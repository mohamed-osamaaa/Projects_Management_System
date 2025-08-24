import { User } from 'src/entities/user.entity';
import {
  FindManyOptions,
  Repository,
} from 'typeorm';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ToggleVerificationBadgeDto } from './dto/toggleVerificationBadge.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async searchByName(name: string): Promise<User[]> {
        try {
        if (!name || name.trim() === '') {
            return [];
        }

        const users = await this.userRepository
            .createQueryBuilder('user')
            .where('LOWER(user.name) LIKE :name', {
                name: `%${name.toLowerCase()}%`,
            })
            .getMany();

        return users;
        } catch (error) {
        console.error('Error in searchByName:', error.message);
        throw new InternalServerErrorException('Failed to search users by name');
        }
    }

    async findAll(page?: number, limit?: number): Promise<{ data: User[]; total: number }> {
        try {
        const options: FindManyOptions<User> = {
            // relations: [
            // 'company',
            // 'projects',
            // 'messages',
            // 'tickets',
            // 'documents',
            // 'notifications',
            // 'inspections',
            // ],
            order: { name: 'ASC' },
        };

        if (page && limit) {
            options.skip = (page - 1) * limit;
            options.take = limit;
        }

        const [data, total] = await this.userRepository.findAndCount(options);

        return { data, total };
        } catch (error) {
        throw new InternalServerErrorException('Failed to fetch users');
        }
    }

    async findOneById(id: string): Promise<User | null> {
        try {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: [
            'company',
            'projects',
            'messages',
            'tickets',
            'documents',
            'notifications',
            'inspections',
            ],
        });

        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return user;
        } catch (error) {
        throw new InternalServerErrorException('Failed to fetch user');
        }
    }

    async deleteById(id: string): Promise<string> {
        try {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        return `User with id ${id} has been deleted`;
        } catch (error) {
        throw new InternalServerErrorException('Failed to delete user');
        }
    }

    async toggleVerificationBadge(userId: string, dto: ToggleVerificationBadgeDto): Promise<User> {
        try {
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException(`User with id ${userId} not found`);
        }

        user.verificationBadge = dto.verificationBadge;
        return this.userRepository.save(user);
        } catch (error) {
        throw new InternalServerErrorException('Failed to update verification badge');
        }
    }
}
