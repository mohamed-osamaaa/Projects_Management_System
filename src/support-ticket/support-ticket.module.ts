import { SupportTicket } from 'src/entities/supportTicket.entity';
import { User } from 'src/entities/user.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SupportTicketsController } from './support-ticket.controller';
import { SupportTicketsService } from './support-ticket.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SupportTicket, User]),
  ],
  controllers: [SupportTicketsController],
  providers: [SupportTicketsService],
})
export class SupportTicketModule { }
