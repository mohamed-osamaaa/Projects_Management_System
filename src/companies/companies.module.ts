import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company
    ]),
    NotificationsModule
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule { }
