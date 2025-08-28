import { Express } from 'express';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }


  @UseGuards(AuthenticationGuard)
  @Post('/projects/:projectId')
  createChat(@Param('projectId') projectId: string) {
    return this.chatService.createChat({ projectId });
  }

  @UseGuards(AuthenticationGuard)
  @Get('/projects/:projectId')
  getProjectChat(@Param('projectId') projectId: string) {
    return this.chatService.getProjectChat(projectId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('/:chatId/messages')
  @UseInterceptors(FileInterceptor('file'))
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body() dto: CreateMessageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    const userId = req.currentUser.id;
    return this.chatService.sendMessage(chatId, userId, dto, file);
  }


}
