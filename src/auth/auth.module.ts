import { User } from 'src/entities/user.entity';

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '1h' },
    }), 
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService , JwtModule],
})
export class AuthModule {}
