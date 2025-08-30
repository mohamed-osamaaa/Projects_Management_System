import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { ContentService } from './static-content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) { }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Post()
  async create(@Body() dto: CreateContentDto) {
    try {
      return await this.contentService.create(dto);
    } catch (err) {
      return { error: err.message };
    }
  }


  @Get()
  async getAll() {
    try {
      return await this.contentService.findAll();
    } catch (err) {
      return { error: err.message };
    }
  }


  @Get(':type')
  async getByType(@Param('type') type: string) {
    try {
      return await this.contentService.findByType(type);
    } catch (err) {
      return { error: err.message };
    }
  }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    try {
      return await this.contentService.update(id, dto);
    } catch (err) {
      return { error: err.message };
    }
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.contentService.remove(id);
    } catch (err) {
      return { error: err.message };
    }
  }
}
