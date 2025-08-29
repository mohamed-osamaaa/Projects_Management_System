import { User } from 'src/entities/user.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    NotificationsModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }
