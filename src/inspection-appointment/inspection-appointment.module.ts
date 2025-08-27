import { Company } from 'src/entities/company.entity';
import {
  InspectionAppointment,
} from 'src/entities/inspectionAppointment.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InspectionsController } from './inspection-appointment.controller';
import { InspectionsService } from './inspection-appointment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InspectionAppointment,
      Project,
      User,
      Company,
    ]), TypeOrmModule.forFeature([InspectionAppointment, Project, User])],
  controllers: [InspectionsController],
  providers: [InspectionsService],
})
export class InspectionAppointmentModule { }
