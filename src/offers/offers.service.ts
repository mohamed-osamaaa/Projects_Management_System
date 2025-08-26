import { Company } from 'src/entities/company.entity';
import { Offer } from 'src/entities/offer.entity';
import { Project } from 'src/entities/project.entity';
import { OfferStatus } from 'src/utils/enums/offerStatus.enum';
import {
    checkProjectExpired,
} from 'src/utils/helpers/checkProjectExpired.helpers';
import { Repository } from 'typeorm';

import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OffersService {
    constructor(
        @InjectRepository(Offer) private readonly offerRepo: Repository<Offer>,
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(Company) private readonly companyRepo: Repository<Company>,
    ) { }

    async create(projectId: string, dto: CreateOfferDto, userId: string): Promise<Offer> {
        try {
            const project = await this.projectRepo.findOne({ where: { id: projectId } });
            if (!project) throw new NotFoundException(`Project ${projectId} not found`);

            await checkProjectExpired(this.projectRepo, projectId);

            const company = await this.companyRepo.findOne({
                where: { owner: { id: userId } },
            });
            if (!company) throw new NotFoundException(`Company not found for user ${userId}`);

            const offer = this.offerRepo.create({ ...dto, project, company });
            return await this.offerRepo.save(offer);
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to create offer');
        }
    }

    async findOne(id: string): Promise<Offer> {
        try {
            const offer = await this.offerRepo.findOne({
                where: { id },
                relations: ['project', 'project.client', 'company'],
            });
            if (!offer) throw new NotFoundException(`Offer ${id} not found`);
            return offer;
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to fetch offer');
        }
    }

    async update(id: string, dto: UpdateOfferDto, userId: string): Promise<Offer> {
        try {
            const offer = await this.findOne(id);

            await checkProjectExpired(this.projectRepo, offer.project.id);

            const company = await this.companyRepo.findOne({ where: { owner: { id: userId } } });
            if (!company) throw new NotFoundException(`Company not found for user ${userId}`);

            if (offer.company.id !== company.id) {
                throw new ForbiddenException('You can only update your own offers');
            }

            Object.assign(offer, dto);
            return await this.offerRepo.save(offer);
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to update offer');
        }
    }

    async updateStatus(id: string, dto: UpdateOfferStatusDto, clientId: string): Promise<Offer> {
        try {
            const offer = await this.findOne(id);

            await checkProjectExpired(this.projectRepo, offer.project.id);

            if (offer.project.client.id !== clientId) {
                throw new ForbiddenException('You are not allowed to change this offer status');
            }

            offer.status = dto.status;
            return await this.offerRepo.save(offer);
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to update offer status');
        }
    }

    async remove(id: string, userId: string): Promise<{ message: string }> {
        try {
            const offer = await this.findOne(id);

            await checkProjectExpired(this.projectRepo, offer.project.id);

            const company = await this.companyRepo.findOne({ where: { owner: { id: userId } } });
            if (!company) throw new NotFoundException(`Company not found for user ${userId}`);

            if (offer.company.id !== company.id) {
                throw new ForbiddenException('You can only delete your own offers');
            }

            await this.offerRepo.delete(id);
            return { message: `Offer ${id} deleted successfully` };
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to delete offer');
        }
    }

    async findMyOffers(userId: string): Promise<Offer[]> {
        try {
            const company = await this.companyRepo.findOne({ where: { owner: { id: userId } } });
            if (!company) throw new NotFoundException(`Company not found for user ${userId}`);

            return await this.offerRepo.find({
                where: { company: { id: company.id } },
                relations: ['project'],
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to fetch offers');
        }
    }

    async findByStatus(status: OfferStatus): Promise<Offer[]> {
        try {
            return await this.offerRepo.find({ where: { status }, relations: ['project', 'company'] });
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to fetch offers by status');
        }
    }

    async getOffersByProjectId(projectId: string): Promise<Offer[]> {
        try {
            if (!projectId) {
                throw new NotFoundException('Project ID is required');
            }

            const project = await this.projectRepo.findOne({ where: { id: projectId } });
            if (!project) throw new NotFoundException(`Project with ID ${projectId} not found`);

            await checkProjectExpired(this.projectRepo, projectId);

            const offers = await this.offerRepo.find({
                where: { project: { id: project.id } },
                relations: ['company', 'project'],
            });

            if (!offers.length) {
                throw new NotFoundException('No offers found for this project');
            }

            return offers;
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to fetch offers by project');
        }
    }
}
