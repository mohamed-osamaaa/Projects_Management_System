import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';

import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('me')
  me(@Req() req) {
    return this.authService.getMe(req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch('profile')
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(req.currentUser.id, dto, req.currentUser);
  }

}
