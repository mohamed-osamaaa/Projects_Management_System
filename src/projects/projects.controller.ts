import { Project } from 'src/entities/project.entity';
import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateProjectDto } from './dto/create-project.dto';
import { RepublishProjectDto } from './dto/republish-project.dto';
import { UpdateProjectStatusDto } from './dto/update-project-status.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @UseGuards(AuthenticationGuard)
  @Post()
  async createProject(
    @Body() dto: CreateProjectDto,
    @Req() req
  ): Promise<Project> {
    const user = req.currentUser;

    if (user.role !== UserRole.CLIENT && user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('You are not allowed to create a project');
    }

    const clientId = user.id;

    return this.projectsService.create(dto, clientId);
  }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN, UserRole.COMPANY, UserRole.ENGINEER]))
  @Get()
  async getProjects(
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
    @Query('companyId') companyId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string
  ): Promise<Project[]> {
    return this.projectsService.findAll({ status, clientId, companyId, startDate, endDate });
  }

  @UseGuards(AuthenticationGuard)
  @Get('my-projects')
  async getMyProjects(@Req() req): Promise<Project[]> {
    const user = req.currentUser;

    switch (user.role) {
      case UserRole.CLIENT:
        return this.projectsService.findClientProjects(user.id);

      case UserRole.COMPANY:
        return this.projectsService.findCompanyProjects(user.id);

      case UserRole.ENGINEER:
        return this.projectsService.findEngineerProjects(user.id);

      default:
        throw new ForbiddenException('you must be logged in to view your projects');
    }
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async getProject(@Param('id') id: string): Promise<Project> {
    return this.projectsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN, UserRole.CLIENT]))
  @Patch(':id')
  async updateProject(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @Req() req
  ): Promise<Project> {
    const user = req.currentUser;
    const project = await this.projectsService.findOne(id);

    if (user.role !== UserRole.ADMIN && user.id !== project.client.id) {
      throw new ForbiddenException('You are not allowed to update this project');
    }
    return this.projectsService.update(id, dto);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id/status')
  async updateProjectStatus(
    @Param('id') id: string,
    @Body() dto: UpdateProjectStatusDto
  ): Promise<Project> {
    return this.projectsService.updateStatus(id, dto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.CLIENT]))
  @Patch(':projectId/republish')
  async republishProject(
    @Param('projectId') projectId: string,
    @Body() dto: RepublishProjectDto,
    @Req() req,
  ): Promise<Project> {
    return this.projectsService.republish(projectId, req.currentUser.id, dto.deadline);
  }
}
