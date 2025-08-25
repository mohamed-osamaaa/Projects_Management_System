import { Project } from 'src/entities/project.entity';
import {
    Between,
    Repository,
} from 'typeorm';

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,
    ) { }

    async create(dto: CreateProjectDto, clientId: string): Promise<Project> {
        try {
            const project = this.projectRepo.create({
                ...dto,
                client: { id: clientId },
            });
            return await this.projectRepo.save(project);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findAll(filters?: {
        status?: string;
        clientId?: string;
        companyId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<Project[]> {
        try {
            const where: any = {};

            if (filters?.status) where.status = filters.status;
            if (filters?.clientId) where.client = { id: filters.clientId };
            if (filters?.startDate && filters?.endDate) {
                where.deadline = Between(new Date(filters.startDate), new Date(filters.endDate));
            }

            return this.projectRepo.find({
                where,
                // relations: ['client', 'offers', 'milestones', 'stages'],
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findOne(id: string): Promise<Project> {
        try {
            const project = await this.projectRepo.findOne({
                where: { id },
                relations: ['client', 'offers', 'milestones', 'stages'],
            });
            if (!project) throw new NotFoundException(`Project ${id} not found`);
            return project;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async update(id: string, dto: UpdateProjectDto): Promise<Project> {
        try {
            const project = await this.findOne(id);
            Object.assign(project, dto);
            return this.projectRepo.save(project);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateStatus(id: string, dto: UpdateProjectStatusDto): Promise<Project> {
        try {
            const project = await this.findOne(id);
            project.status = dto.status;
            return this.projectRepo.save(project);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findClientProjects(clientId: string): Promise<Project[]> {
        try {
            return this.projectRepo.find({ where: { client: { id: clientId } } });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findCompanyProjects(companyId: string): Promise<Project[]> {
        try {
            return this.projectRepo.find({
                relations: ['offers'],
                where: { offers: { company: { id: companyId } } },
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findEngineerProjects(engineerId: string): Promise<Project[]> {
        return this.projectRepo.find({
            relations: ['inspections', 'inspections.engineer'],
            where: { inspections: { engineer: { id: engineerId } } },
        });
    }
}
