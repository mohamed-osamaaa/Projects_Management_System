import { dataSourceOptions } from 'database/data-source';

import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CompaniesModule } from './companies/companies.module';
import {
  InspectionAppointmentModule,
} from './inspection-appointment/inspection-appointment.module';
import { MilestonesModule } from './milestones/milestones.module';
import { OffersModule } from './offers/offers.module';
import { PaymentModule } from './payment/payment.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import {
  CurrentUserMiddleware,
} from './utils/middlewares/currentUser.middleware';
import { NotificationsModule } from './notifications/notifications.module';
import { ProjectDocumentsModule } from './project-documents/project-documents.module';
import { SupportTicketModule } from './support-ticket/support-ticket.module';
import { StaticContentModule } from './static-content/static-content.module';
import { DashboardsModule } from './dashboards/dashboards.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    UsersModule,
    CompaniesModule,
    ProjectsModule,
    OffersModule,
    MilestonesModule,
    PaymentModule,
    InspectionAppointmentModule,
    ChatModule,
    NotificationsModule,
    ProjectDocumentsModule,
    SupportTicketModule,
    StaticContentModule,
    DashboardsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CurrentUserMiddleware
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}