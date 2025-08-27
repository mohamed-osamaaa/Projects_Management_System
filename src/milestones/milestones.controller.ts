import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneStatusDto } from './dto/update-milestone-status.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestonesService } from './milestones.service';

@Controller('milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) { }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY]))
  @Post('/projects/:projectId')
  async create(@Param('projectId') projectId: string, @Body() dto: CreateMilestoneDto, @Req() req) {
    return this.milestonesService.create(projectId, req.currentUser.id, dto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('/projects/:projectId')
  async findAllByProject(@Param('projectId') projectId: string) {
    return this.milestonesService.findAllByProject(projectId);
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.milestonesService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN, UserRole.COMPANY]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMilestoneDto) {
    return this.milestonesService.update(id, dto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN, UserRole.COMPANY]))
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateMilestoneStatusDto) {
    return this.milestonesService.updateStatus(id, dto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN, UserRole.COMPANY]))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.milestonesService.remove(id);
  }
}
