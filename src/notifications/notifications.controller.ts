import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @UseGuards(AuthenticationGuard)
  @Patch('mark-all-read')
  async markAllAsRead(@Req() req) {
    await this.notificationsService.markAllAsRead(req.currentUser.id);
    return { message: 'All notifications marked as read' };
  }

  @UseGuards(AuthenticationGuard)
  @Get('unread/:userId')
  async getUnread(@Param('userId') userId: string) {
    return await this.notificationsService.getUnreadNotifications(userId);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @Body() updateDto: UpdateNotificationDto
  ) {
    if (!updateDto.isRead) {
      return { message: "Send isRead: true to mark as read" };
    }
    return await this.notificationsService.markAsRead(id);
  }


}
