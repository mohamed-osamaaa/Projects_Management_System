import { Milestone } from 'src/entities/milestone.entity';
import { Offer } from 'src/entities/offer.entity';
import { Project } from 'src/entities/project.entity';
import { Repository } from 'typeorm';

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneStatusDto } from './dto/update-milestone-status.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
    constructor(
        @InjectRepository(Milestone) private readonly milestoneRepo: Repository<Milestone>,
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(Offer) private readonly offerRepo: Repository<Offer>,
    ) { }

    async create(projectId: string, dto: CreateMilestoneDto): Promise<Milestone> {
        try {
            const project = await this.projectRepo.findOne({ where: { id: projectId } });
            if (!project) throw new NotFoundException(`Project ${projectId} not found`);

            const milestoneData: Partial<Milestone> = {
                ...dto,
                project,
            };

            const milestone = this.milestoneRepo.create(milestoneData);
            return await this.milestoneRepo.save(milestone);
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to create milestone');
        }
    }


    async findAllByProject(projectId: string): Promise<Milestone[]> {
        try {
            return await this.milestoneRepo.find({ where: { project: { id: projectId } }, relations: ['project'] });
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to fetch milestones');
        }
    }

    async findOne(id: string): Promise<Milestone> {
        try {
            const milestone = await this.milestoneRepo.findOne({ where: { id }, relations: ['project'] });
            if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);
            return milestone;
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to fetch milestone');
        }
    }

    async update(id: string, dto: UpdateMilestoneDto): Promise<Milestone> {
        try {
            const milestone = await this.milestoneRepo.preload({ id, ...dto });
            if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);
            return this.milestoneRepo.save(milestone);
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to update milestone');
        }
    }

    async updateStatus(id: string, dto: UpdateMilestoneStatusDto): Promise<Milestone> {
        try {
            const milestone = await this.findOne(id);
            milestone.milestoneStatus = dto.milestoneStatus;
            return await this.milestoneRepo.save(milestone);
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to update milestone status');
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            await this.findOne(id);
            await this.milestoneRepo.delete(id);
            return { message: `Milestone ${id} deleted successfully` };
        } catch (error) {
            throw new InternalServerErrorException(error.message || 'Failed to delete milestone');
        }
    }
}
