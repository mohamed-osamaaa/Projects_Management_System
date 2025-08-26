import { Offer } from 'src/entities/offer.entity';
import { OfferStatus } from 'src/utils/enums/offerStatus.enum';
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
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferStatusDto } from './dto/update-offer-status.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { OffersService } from './offers.service';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) { }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY]))
  @Post('/projects/:projectId')
  async createOffer(@Param('projectId') projectId: string, @Body() dto: CreateOfferDto, @Req() req): Promise<Offer> {
    return this.offersService.create(projectId, dto, req.currentUser.id);
  }


  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async getOffer(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOne(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.CLIENT]))
  @Patch(':id/status')
  async updateOfferStatus(@Param('id') id: string, @Body() dto: UpdateOfferStatusDto, @Req() req): Promise<Offer> {
    return this.offersService.updateStatus(id, dto, req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY]))
  @Patch(':id')
  async updateOffer(@Param('id') id: string, @Body() dto: UpdateOfferDto, @Req() req): Promise<Offer> {
    return this.offersService.update(id, dto, req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY]))
  @Delete(':id')
  async removeOffer(@Param('id') id: string, @Req() req): Promise<{ message: string }> {
    return this.offersService.remove(id, req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY]))
  @Get('/companies/my-offers')
  async getMyOffers(@Req() req): Promise<Offer[]> {
    return this.offersService.findMyOffers(req.currentUser.id);
  }


  @UseGuards(
    AuthenticationGuard,
    AuthorizeGuard([UserRole.ADMIN, UserRole.CLIENT, UserRole.COMPANY]),
  )
  @Get()
  async getOffersByStatus(@Query('status') status?: OfferStatus): Promise<Offer[]> {
    if (!status) {
      throw new NotFoundException('You must provide a status');
    }

    if (!Object.values(OfferStatus).includes(status)) {
      throw new NotFoundException(`Invalid status: ${status}`);
    }

    return this.offersService.findByStatus(status);
  }


  @UseGuards(AuthenticationGuard)
  @Get('by-project/:projectId')
  async getOffersByProjectId(@Param('projectId') projectId: string): Promise<Offer[]> {
    return this.offersService.getOffersByProjectId(projectId);
  }

}