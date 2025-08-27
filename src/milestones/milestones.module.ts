import { Company } from 'src/entities/company.entity';
import { Milestone } from 'src/entities/milestone.entity';
import { Project } from 'src/entities/project.entity';

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
  ],
  controllers: [MilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule { }
