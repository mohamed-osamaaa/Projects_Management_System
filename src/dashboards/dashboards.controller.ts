import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';

import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { DashboardsService } from './dashboards.service';

@Controller('dashboards')
export class DashboardsController {
  constructor(private readonly dashboardsService: DashboardsService) { }

  @UseGuards(AuthenticationGuard)
  @Get('client')
  async getClientDashboard(@Req() req) {
    return await this.dashboardsService.getClientDashboard(req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('company')
  async getCompanyDashboard(@Req() req) {
    if (!req.currentUser.id) {
      return { message: 'This user is not linked to a company' };
    }
    return await this.dashboardsService.getCompanyDashboard(req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get('engineer')
  async getEngineerDashboard(@Req() req) {
    return await this.dashboardsService.getEngineerDashboard(req.currentUser.id);
  }
}
