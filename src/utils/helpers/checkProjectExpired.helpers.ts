import { Project } from 'src/entities/project.entity';
import { ProjectStatus } from 'src/utils/enums/projectStatus.enum';
import { Repository } from 'typeorm';

import {
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';

export async function checkProjectExpired(
    projectRepo: Repository<Project>,
    projectId: string,
): Promise<Project> {
    const project = await projectRepo.findOne({ where: { id: projectId } });

    if (!project) {
        throw new NotFoundException(`Project ${projectId} not found`);
    }

    if (project.deadline && new Date(project.deadline) < new Date()) {
        project.status = ProjectStatus.EXPIRED;
        await projectRepo.save(project);
        throw new ForbiddenException(`Project ${projectId} has expired`);
    }

    if (project.status === ProjectStatus.EXPIRED) {
        throw new ForbiddenException(`Project ${projectId} is expired`);
    }

    return project;
}