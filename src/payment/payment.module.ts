import { Milestone } from 'src/entities/milestone.entity';
import { Payment } from 'src/entities/payment.entity';
import { User } from 'src/entities/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentsController } from './payment.controller';
import { PaymentsService } from './payment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Payment,
      Milestone,
      User
    ]),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentModule { }
