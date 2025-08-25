import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateEngineerDto } from './dto/create-engineer.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get()
  async getCompanies(): Promise<Company[]> {
    return this.companiesService.findAll();
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get(':id')
  async getCompany(@Param('id') id: string): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @Post()
  async createCompany(@Body() dto: CreateCompanyDto): Promise<Company> {
    return this.companiesService.create(dto);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async updateCompany(
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDto,
    @Req() req
  ): Promise<Company> {
    const user = req.currentUser;
    const company = await this.companiesService.findOne(id);

    if (user.role !== UserRole.ADMIN && user.id !== company.owner.id) {
      throw new ForbiddenException("You are not allowed to update this company");
    }
    return this.companiesService.update(id, dto);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Delete(':id')
  async deleteCompany(@Param('id') id: string): Promise<{ message: string }> {
    return this.companiesService.remove(id);
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id/engineers')
  async getEngineers(@Param('id') id: string): Promise<User[]> {
    return this.companiesService.findEngineers(id);
  }

  @UseGuards(AuthenticationGuard)
  @Post(':id/engineers')
  async addEngineer(
    @Param('id') id: string,
    @Body() dto: CreateEngineerDto,
    @Req() req
  ): Promise<User> {
    const user = req.currentUser;
    const company = await this.companiesService.findOne(id);

    if (user.role !== UserRole.ADMIN && user.id !== company.owner.id) {
      throw new ForbiddenException("You are not allowed to add engineers to this company");
    }

    return this.companiesService.addEngineer(id, dto);
  }



  @UseGuards(AuthenticationGuard)
  @Delete(':id/engineers/:engineerId')
  async removeEngineer(
    @Param('id') companyId: string,
    @Param('engineerId') engineerId: string,
    @Req() req
  ): Promise<{ message: string }> {
    const user = req.currentUser;
    const company = await this.companiesService.findOne(companyId);

    if (user.role !== UserRole.ADMIN && user.id !== company.owner.id) {
      throw new ForbiddenException("You are not allowed to remove engineers from this company");
    }

    return this.companiesService.removeEngineer(companyId, engineerId);
  }

}
