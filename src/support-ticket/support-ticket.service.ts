import { SupportTicket } from 'src/entities/supportTicket.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketPriorityDto } from './dto/update-ticket-priority.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Injectable()
export class SupportTicketsService {
    constructor(
        @InjectRepository(SupportTicket)
        private ticketsRepo: Repository<SupportTicket>,

        @InjectRepository(User)
        private usersRepo: Repository<User>,
    ) { }

    async create(dto: CreateTicketDto, userId: string) {
        try {
            const user = await this.usersRepo.findOneBy({ id: userId });
            if (!user) throw new Error('User not found');

            const ticket = this.ticketsRepo.create({
                ...dto,
                user,
            });

            return await this.ticketsRepo.save(ticket);
        } catch (err) {
            throw new Error('Failed to create ticket: ' + err.message);
        }
    }

    async findAll() {
        try {
            return await this.ticketsRepo.find({ relations: ['user'] });
        } catch (err) {
            throw new Error('Failed to fetch tickets: ' + err.message);
        }
    }

    async updateStatus(id: string, dto: UpdateTicketStatusDto) {
        try {
            const ticket = await this.ticketsRepo.findOne({ where: { id } });
            if (!ticket) throw new NotFoundException('Ticket not found');

            ticket.status = dto.status;
            return await this.ticketsRepo.save(ticket);
        } catch (err) {
            throw err;
        }
    }

    async updatePriority(id: string, dto: UpdateTicketPriorityDto) {
        try {
            const ticket = await this.ticketsRepo.findOne({ where: { id } });
            if (!ticket) throw new NotFoundException('Ticket not found');

            ticket.priority = dto.priority;
            return await this.ticketsRepo.save(ticket);
        } catch (err) {
            throw err;
        }
    }
}
