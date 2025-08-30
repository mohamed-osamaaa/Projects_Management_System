import { Company } from 'src/entities/company.entity';
import {
    InspectionAppointment,
} from 'src/entities/inspectionAppointment.entity';
import { Payment } from 'src/entities/payment.entity';
import { Project } from 'src/entities/project.entity';
import { InspectionStatus } from 'src/utils/enums/inspectionAppointment.enum';
import { ProjectStatus } from 'src/utils/enums/projectStatus.enum';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DashboardsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,

        @InjectRepository(Payment)
        private readonly paymentRepo: Repository<Payment>,

        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,

        @InjectRepository(InspectionAppointment)
        private readonly inspectionRepo: Repository<InspectionAppointment>,
    ) { }

    async getClientDashboard(clientId: string) {
        try {
            const [totalProjects, pending, ongoing, completed] = await Promise.all([
                this.projectRepo.count({ where: { client: { id: clientId } } }),
                this.projectRepo.count({
                    where: { client: { id: clientId }, status: ProjectStatus.PENDING },
                }),
                this.projectRepo.count({
                    where: { client: { id: clientId }, status: ProjectStatus.IN_PROGRESS },
                }),
                this.projectRepo.count({
                    where: { client: { id: clientId }, status: ProjectStatus.COMPLETED },
                }),
            ]);

            const { totalPaid } = await this.paymentRepo
                .createQueryBuilder('payment')
                .leftJoin('payment.milestone', 'milestone')
                .select('SUM(milestone.amount)', 'totalPaid')
                .where('payment.paymentById = :clientId', { clientId })
                .getRawOne();


            const upcomingInspections = await this.inspectionRepo.count({
                where: {
                    project: { client: { id: clientId } },
                    status: InspectionStatus.PENDING,
                },
            });

            return {
                projects: { total: totalProjects, pending, ongoing, completed },
                payments: { totalPaid: Number(totalPaid) || 0 },
                inspections: { upcoming: upcomingInspections },
            };
        } catch (error) {
            console.error('Error in getClientDashboard:', error.message);
            return {
                projects: { total: 0, pending: 0, ongoing: 0, completed: 0 },
                payments: { totalPaid: 0 },
                inspections: { upcoming: 0 },
                error: error.message,
            };
        }
    }

    async getCompanyDashboard(ownerId: string) {
        try {
            const company = await this.companyRepo.findOne({
                where: { owner: { id: ownerId } },
                relations: ['engineers', 'offers'],
            });

            if (!company) {
                throw new Error('Company not found');
            }

            const { revenue } = await this.paymentRepo
                .createQueryBuilder('payment')
                .leftJoin('payment.milestone', 'milestone')
                .select('SUM(milestone.amount)', 'revenue')
                .where('payment.paymentTo = :companyId', { companyId: company.id })
                .getRawOne();


            const inspections = await this.inspectionRepo.count({
                where: { company: { id: company.id } },
            });

            return {
                company: {
                    name: company.name,
                    engineers: company.engineers?.length || 0,
                    offers: company.offers?.length || 0,
                },
                revenue: Number(revenue) || 0,
                inspections,
            };
        } catch (error) {
            console.error('Error in getCompanyDashboard:', error.message);
            return {
                company: { name: null, engineers: 0, offers: 0 },
                revenue: 0,
                inspections: 0,
                error: error.message,
            };
        }
    }

    async getEngineerDashboard(engineerId: string) {
        try {
            const totalInspections = await this.inspectionRepo.count({
                where: { engineer: { id: engineerId } },
            });

            const completedInspections = await this.inspectionRepo.count({
                where: {
                    engineer: { id: engineerId },
                    status: InspectionStatus.ACCEPTED,
                },
            });

            const upcomingInspections = await this.inspectionRepo.count({
                where: {
                    engineer: { id: engineerId },
                    status: InspectionStatus.PENDING,
                },
            });

            return {
                inspections: {
                    total: totalInspections,
                    completed: completedInspections,
                    upcoming: upcomingInspections,
                },
                performance:
                    totalInspections > 0
                        ? Number(((completedInspections / totalInspections) * 100).toFixed(2))
                        : 0,
            };
        } catch (error) {
            console.error('Error in getEngineerDashboard:', error);
            return {
                inspections: { total: 0, completed: 0, upcoming: 0 },
                performance: 0,
                error: error instanceof Error ? error.message : String(error),
            };
        }
    }
}
