import { SupportTicket } from 'src/entities/supportTicket.entity';
import { User } from 'src/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
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

        private notificationsService: NotificationsService,
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
            const updatedTicket = await this.ticketsRepo.save(ticket);

            await this.notificationsService.createNotification(
                ticket.user.id,
                `تم تغيير حالة التذكرة إلى ${dto.status}.`
            );

            return updatedTicket;
        } catch (err) {
            throw err;
        }
    }

    async updatePriority(id: string, dto: UpdateTicketPriorityDto) {
        try {
            const ticket = await this.ticketsRepo.findOne({ where: { id } });
            if (!ticket) throw new NotFoundException('Ticket not found');

            ticket.priority = dto.priority;
            const updatedTicket = await this.ticketsRepo.save(ticket);

            await this.notificationsService.createNotification(
                ticket.user.id,
                `تم تغيير أولوية التذكرة إلى ${dto.priority}.`
            );

            return updatedTicket;
        } catch (err) {
            throw err;
        }
    }
}
