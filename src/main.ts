import helmet from 'helmet';

import {
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import {
  NestFactory,
  Reflector,
} from '@nestjs/core';

import { AppModule } from './app.module';
import {
  AllExceptionsFilter,
} from './utils/globalExceptions/allExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Allow all origins (change this for security)
    // origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalFilters(new AllExceptionsFilter());
  //web hook stripe in production
  // Raw body only for Stripe webhook
  // app.use('/payments/webhook', raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
