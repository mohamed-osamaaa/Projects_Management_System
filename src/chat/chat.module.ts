import { Chat } from 'src/entities/chat.entity';
import { Message } from 'src/entities/message.entity';
import { Project } from 'src/entities/project.entity';
import { User } from 'src/entities/user.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat,
      Message,
      Project,
      User
    ]),
    CloudinaryModule,
    NotificationsModule
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule { }
