import { Company } from 'src/entities/company.entity';
import {
  InspectionAppointment,
} from 'src/entities/inspectionAppointment.entity';
import { Payment } from 'src/entities/payment.entity';
import { Project } from 'src/entities/project.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DashboardsController } from './dashboards.controller';
import { DashboardsService } from './dashboards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Company,
      Payment,
      InspectionAppointment
    ]),
  ],
  controllers: [DashboardsController],
  providers: [DashboardsService],
})
export class DashboardsModule { }
