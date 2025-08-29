import { Company } from 'src/entities/company.entity';
import {
    InspectionAppointment,
} from 'src/entities/inspectionAppointment.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AssignEngineerDto } from './dto/assign-engineer.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionStatusDto } from './dto/update-inspection-status.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';

@Injectable()
export class InspectionsService {
    constructor(
        @InjectRepository(InspectionAppointment)
        private readonly inspectionRepo: Repository<InspectionAppointment>,

        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,

        private readonly notificationsService: NotificationsService,
    ) { }

    async create(projectId: string, dto: CreateInspectionDto): Promise<InspectionAppointment> {
        try {
            const project = await this.projectRepo.findOne({ where: { id: projectId } });
            if (!project) throw new NotFoundException('Project not found');

            const company = await this.companyRepo.findOne({
                where: { id: dto.companyId },
                relations: ['owner'],
            });
            if (!company) throw new NotFoundException('Company not found');

            const inspection = this.inspectionRepo.create({
                date: dto.date,
                project,
                company,
            });

            const savedInspection = await this.inspectionRepo.save(inspection);

            await this.notificationsService.createNotification(
                company.owner.id,
                `تم حجز موعد فحص جديد من قبل العميل ${project.client.name}.`
            );

            return savedInspection;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findProjectInspections(projectId: string): Promise<InspectionAppointment[]> {
        try {
            return this.inspectionRepo.find({
                where: { project: { id: projectId } },
                relations: ['project', 'company', 'engineer'],
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async update(id: string, dto: UpdateInspectionDto): Promise<InspectionAppointment> {
        try {
            const inspection = await this.inspectionRepo.findOne({
                where: { id },
            });
            if (!inspection) throw new NotFoundException('Inspection not found');

            Object.assign(inspection, dto);
            return await this.inspectionRepo.save(inspection);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async assignEngineer(id: string, dto: AssignEngineerDto): Promise<InspectionAppointment> {
        try {
            const inspection = await this.inspectionRepo.findOne({
                where: { id },
            });
            if (!inspection) throw new NotFoundException('Inspection not found');

            const engineer = await this.userRepo.findOne({ where: { id: dto.engineerId } });
            if (!engineer) throw new NotFoundException('Engineer not found');

            inspection.engineer = engineer;
            const updatedInspection = await this.inspectionRepo.save(inspection);

            await this.notificationsService.createNotification(
                engineer.id,
                'تم تعيينك لموعد فحص جديد.'
            );

            return updatedInspection;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateStatus(id: string, dto: UpdateInspectionStatusDto): Promise<InspectionAppointment> {
        try {
            const inspection = await this.inspectionRepo.findOne({
                where: { id },
            });
            if (!inspection) throw new NotFoundException('Inspection not found');

            inspection.status = dto.status;
            const updatedInspection = await this.inspectionRepo.save(inspection);

            await this.notificationsService.createNotification(
                inspection.project.client.id,
                `تم ${dto.status === 'accepted' ? 'قبول' : 'رفض'} طلب الفحص.`
            );

            return updatedInspection;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findEngineerInspections(engineerId: string): Promise<InspectionAppointment[]> {
        return this.inspectionRepo.find({
            where: { engineer: { id: engineerId } },
            relations: ['engineer', 'project', 'company'],
        });
    }
}
