import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketPriorityDto } from './dto/update-ticket-priority.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { SupportTicketsService } from './support-ticket.service';

@Controller('support/tickets')
export class SupportTicketsController {
  constructor(private readonly ticketsService: SupportTicketsService) { }

  @UseGuards(AuthenticationGuard)
  @Post()
  async create(@Body() dto: CreateTicketDto, @Req() req) {
    try {
      return await this.ticketsService.create(dto, req.currentUser.id);
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.CUSTOMER_SERVICE]))
  @Get()
  async findAll() {
    try {
      return await this.ticketsService.findAll();
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.CUSTOMER_SERVICE]))
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateTicketStatusDto) {
    try {
      return await this.ticketsService.updateStatus(id, dto);
    } catch (err) {
      return { error: err.message };
    }
  }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN, UserRole.CUSTOMER_SERVICE]))
  @Patch(':id/priority')
  async updatePriority(@Param('id') id: string, @Body() dto: UpdateTicketPriorityDto) {
    try {
      return await this.ticketsService.updatePriority(id, dto);
    } catch (err) {
      return { error: err.message };
    }
  }
}
