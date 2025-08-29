import { Express } from 'express';
import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';

import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
    constructor(
        private readonly cloudinaryService: CloudinaryService,
        private readonly notificationsService: NotificationsService,
        @InjectRepository(Chat) private readonly chatRepo: Repository<Chat>,
        @InjectRepository(Message) private readonly messageRepo: Repository<Message>,
        @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
        @InjectRepository(User) private readonly userRepo: Repository<User>,
    ) { }

    async createChat(dto: CreateChatDto): Promise<Chat> {
        try {
            const project = await this.projectRepo.findOne({ where: { id: dto.projectId } });
            if (!project) throw new NotFoundException('Project not found');

            const existingChat = await this.chatRepo.findOne({ where: { project: { id: dto.projectId } } });
            if (existingChat) {
                throw new BadRequestException('Chat already exists for this project');
            }

            const chat = this.chatRepo.create({ project });
            return await this.chatRepo.save(chat);
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async getProjectChat(projectId: string): Promise<Chat[]> {
        return this.chatRepo.find({
            where: { project: { id: projectId } },
            relations: ['messages'],
        });
    }

    async sendMessage(
        chatId: string,
        senderId: string,
        dto: CreateMessageDto,
        file?: Express.Multer.File,
    ): Promise<Message> {
        try {
            const chat = await this.chatRepo.findOne({
                where: { id: chatId },
                relations: ['project', 'project.client'],
            });
            if (!chat) throw new NotFoundException('Chat not found');

            const sender = await this.userRepo.findOne({ where: { id: senderId } });
            if (!sender) throw new NotFoundException('User not found');

            let attachmentUrl: string | undefined = undefined;
            if (file) {
                const result = await this.cloudinaryService.uploadFile(file);

                attachmentUrl = result.secure_url;
            }

            const message = this.messageRepo.create({
                ...dto,
                chat,
                sender,
                attachmentUrl,
            });

            const savedMessage = await this.messageRepo.save(message);

            if (chat.project.client.id !== sender.id) {
                await this.notificationsService.createNotification(
                    chat.project.client.id,
                    `لديك رسالة جديدة من ${sender.name} في مشروعك ${chat.project.title}.`
                );
            }

            return savedMessage;
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

}
