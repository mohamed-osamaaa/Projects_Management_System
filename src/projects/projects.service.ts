import { Project } from 'src/entities/project.entity';
import { ProjectStatus } from 'src/utils/enums/projectStatus.enum';
import {
    checkProjectExpired,
} from 'src/utils/helpers/checkProjectExpired.helpers';
import {
    Between,
    Repository,
} from 'typeorm';

import {
    BadRequestException,
    ForbiddenException,
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
                where.deadline = Between(
                    new Date(filters.startDate),
                    new Date(filters.endDate),
                );
            }

            return this.projectRepo.find({
                where,
                relations: ['client', 'offers', 'milestones', 'stages'],
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectRepo.findOne({
            where: { id },
            relations: ['client', 'offers', 'milestones', 'stages'],
        });
        if (!project) throw new NotFoundException(`Project ${id} not found`);
        return project;
    }

    async update(id: string, dto: UpdateProjectDto): Promise<Project> {
        await checkProjectExpired(this.projectRepo, id);

        const project = await this.findOne(id);
        Object.assign(project, dto);
        return this.projectRepo.save(project);
    }

    async updateStatus(id: string, dto: UpdateProjectStatusDto): Promise<Project> {
        try {
            const project = await this.findOne(id);

            if (!Object.values(ProjectStatus).includes(dto.status)) {
                throw new BadRequestException('Invalid project status');
            }

            project.status = dto.status;
            return this.projectRepo.save(project);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findClientProjects(clientId: string): Promise<Project[]> {
        return this.projectRepo.find({
            where: { client: { id: clientId } },
        });
    }

    async findCompanyProjects(companyId: string): Promise<Project[]> {
        return this.projectRepo.find({
            relations: ['offers'],
            where: { offers: { company: { id: companyId } } },
        });
    }

    async findEngineerProjects(engineerId: string): Promise<Project[]> {
        return this.projectRepo.find({
            relations: ['inspections', 'inspections.engineer'],
            where: { inspections: { engineer: { id: engineerId } } },
        });
    }

    async republish(
        projectId: string,
        clientId: string,
        deadline: string,
    ): Promise<Project> {
        const project = await this.projectRepo.findOne({
            where: { id: projectId },
            relations: ['client'],
        });

        if (!project) throw new NotFoundException(`Project ${projectId} not found`);

        if (project.client.id !== clientId) {
            throw new ForbiddenException(
                'You are not allowed to republish this project',
            );
        }

        if (project.status !== ProjectStatus.EXPIRED) {
            throw new ForbiddenException('Only expired projects can be republished');
        }

        project.status = ProjectStatus.REPUBLISHED;
        project.deadline = new Date(deadline);

        return this.projectRepo.save(project);
    }
}
