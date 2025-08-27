import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AssignEngineerDto } from './dto/assign-engineer.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { UpdateInspectionStatusDto } from './dto/update-inspection-status.dto';
import { UpdateInspectionDto } from './dto/update-inspection.dto';
import { InspectionsService } from './inspection-appointment.service';

@Controller('inspections')
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) { }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ENGINEER]))
  @Get('my')
  async myInspections(@Req() req) {
    return this.inspectionsService.findEngineerInspections(req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.CLIENT]))
  @Post(':projectId')
  async create(@Param('projectId') projectId: string, @Body() dto: CreateInspectionDto) {
    return this.inspectionsService.create(projectId, dto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN, UserRole.CLIENT, UserRole.ENGINEER, UserRole.COMPANY]))
  @Get(':projectId')
  async findProjectInspections(@Param('projectId') projectId: string) {
    return this.inspectionsService.findProjectInspections(projectId);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.CLIENT]))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateInspectionDto) {
    return this.inspectionsService.update(id, dto);
  }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY]))
  @Patch('assign-engineer/:id')
  async assignEngineer(@Param('id') id: string, @Body() dto: AssignEngineerDto) {
    return this.inspectionsService.assignEngineer(id, dto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY]))
  @Patch('status/:id')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateInspectionStatusDto) {
    return this.inspectionsService.updateStatus(id, dto);
  }

}
