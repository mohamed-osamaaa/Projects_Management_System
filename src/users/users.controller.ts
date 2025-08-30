import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';

import { ToggleVerificationBadgeDto } from './dto/toggleVerificationBadge.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }


  @UseGuards(AuthenticationGuard)
  @Get('search')
  async searchByName(@Query('name') name: string): Promise<User[]> {
    return this.usersService.searchByName(name);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<{ data: User[]; total: number }> {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    return this.usersService.findAll(pageNumber, limitNumber);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Delete(':id')
  async deleteById(@Param('id') id: string): Promise<{ message: string }> {
    const message = await this.usersService.deleteById(id);
    return { message };
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Patch(':id/verification')
  async toggleVerification(
    @Param('id') id: string,
    @Body() dto: ToggleVerificationBadgeDto,
  ): Promise<User> {
    return this.usersService.toggleVerificationBadge(id, dto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Patch('make-admin/:id')
  async makeAdmin(@Param('id') id: string) {
    return this.usersService.makeAdminById(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.CUSTOMER_SERVICE]))
  @Patch('make-customer-service/:id')
  async makeCustomerService(@Param('id') id: string) {
    return this.usersService.makeCustomerServiceById(id);
  }

}
