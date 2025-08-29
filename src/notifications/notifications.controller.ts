import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';

import {
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

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
  @Get('unread')
  async getUnread(@Req() req) {
    return await this.notificationsService.getUnreadNotifications(req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string
  ) {
    return await this.notificationsService.markAsRead(id);
  }


}
