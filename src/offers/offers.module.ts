import { Company } from 'src/entities/company.entity';
import { Offer } from 'src/entities/offer.entity';
import { Project } from 'src/entities/project.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Offer,
      Project,
      Company
    ]),
  ],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule { }
