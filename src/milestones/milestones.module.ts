import { Company } from 'src/entities/company.entity';
import { Milestone } from 'src/entities/milestone.entity';
import { Project } from 'src/entities/project.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Milestone,
      Project,
      Company
    ]),
    NotificationsModule,
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule { }
