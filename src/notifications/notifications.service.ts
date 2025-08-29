import { Notification } from 'src/entities/notification.entity';
import { Repository } from 'typeorm';

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
    ) { }


    async createNotification(userId: string, message: string): Promise<Notification> {
        try {
            const notification = this.notificationRepo.create({
                user: { id: userId },
                message,
            });

            return await this.notificationRepo.save(notification);
        } catch (err) {
            throw new InternalServerErrorException('Error creating notification');
        }
    }


    async getUnreadNotifications(userId: string): Promise<Notification[]> {
        try {
            return await this.notificationRepo.find({
                where: { user: { id: userId }, isRead: false }
            });
        } catch (err) {
            throw new InternalServerErrorException('Error fetching unread notifications');
        }
    }

    async markAsRead(notificationId: string): Promise<Notification> {
        try {
            const notification = await this.notificationRepo.findOne({ where: { id: notificationId } });
            if (!notification) throw new NotFoundException('Notification not found');

            notification.isRead = true;
            return await this.notificationRepo.save(notification);
        } catch (err) {
            throw err;
        }
    }

    async markAllAsRead(userId: string): Promise<void> {
        try {
            await this.notificationRepo
                .createQueryBuilder()
                .update(Notification)
                .set({ isRead: true })
                .where("userId = :userId", { userId })
                .andWhere("isRead = :isRead", { isRead: false })
                .execute();
        } catch (err) {
            throw new InternalServerErrorException('Error marking all notifications as read');
        }
    }

}
