import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';

import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { LoginDto } from './dto/login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService
  ) { }

  async register(dto: RegisterUserDto): Promise<User> {
    try {
      const existing = await this.usersRepository.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('Email already registered');
      }

      const hashedPassword = await bcrypt.hash(dto.password, 10);

      const user = this.usersRepository.create({
        ...dto,
        password: hashedPassword,
      });

      const savedUser = await this.usersRepository.save(user);

      await this.notificationsService.createNotification(
        savedUser.id,
        'مرحبا بك 👋 تم إنشاء حسابك بنجاح.',
      );

      return savedUser;
    } catch (error) {
      throw new InternalServerErrorException('Failed to register user');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.usersRepository.findOne({ where: { email: dto.email } });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(dto.password, user.password);
      if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');

      const payload = { id: user.id, role: user.role };
      const token = await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '24h',
      });

      return { accessToken: token, user };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new InternalServerErrorException('Failed to login');
    }
  }

  async getMe(userId: string) {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch user profile');
    }
  }

  async updateProfile(userId: string, dto: UpdateProfileDto, currentUser: User): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('User not found');

      if (currentUser.id !== user.id) {
        throw new ForbiddenException("You can only update your own profile");
      }

      Object.assign(user, dto);
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) throw error;
      throw new InternalServerErrorException('Failed to update profile');
    }
  }


  async findOneById(id: string) {
    try {
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user by id');
    }
  }
}
