import { UserRole } from 'src/utils/enums/userRoles.enum';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utils/guards/authorization.guard';

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentsService } from './payment.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @UseGuards(AuthenticationGuard)
  @Post(':milestoneId')
  async makePayment(
    @Param('milestoneId') milestoneId: string,
    @Body() dto: CreatePaymentDto,
    @Req() req,
  ) {
    try {
      return await this.paymentsService.makePayment(
        milestoneId,
        req.currentUser.id,
        dto.successUrl,
        dto.cancelUrl,
      );
    } catch (error) {
      throw error;
    }
  }

  //web hook in production
  //with token in production
  // @Post('webhook')
  // async handleStripeWebhook(@Req() req: Request, @Res() res: Response) {
  //   const sig = req.headers['stripe-signature'] as string;
  //   let event: Stripe.Event;

  //   try {
  //     // req.body here is raw buffer (because of raw() middleware in main.ts)
  //     event = this.stripe.webhooks.constructEvent(
  //       req.body,
  //       sig,
  //       process.env.STRIPE_WEBHOOK_SECRET as string,
  //     );
  //   } catch (err) {
  //     return res.status(400).send(`Webhook Error: ${err.message}`);
  //   }

  //   if (event.type === 'checkout.session.completed') {
  //     const session = event.data.object as Stripe.Checkout.Session;
  //     await this.paymentsService.confirmPayment(session);
  //   }

  //    return { received: true };
  // }


  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get('/all')
  async getAllPayments() {
    try {
      return await this.paymentsService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.COMPANY, UserRole.CLIENT]))
  @Get('/my-payments')
  async getMyPayments(@Req() req) {
    try {
      return await this.paymentsService.findMyPayments(
        req.currentUser.id,
        req.currentUser.role
      );
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthenticationGuard, AuthorizeGuard([UserRole.ADMIN]))
  @Get('/stats')
  async getStats() {
    try {
      return await this.paymentsService.getStats();
    } catch (error) {
      throw error;
    }
  }
}
