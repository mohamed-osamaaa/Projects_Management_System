import { User } from 'src/entities/user.entity';
import {
  FindManyOptions,
  Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ToggleVerificationBadgeDto } from './dto/toggleVerificationBadge.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async findAll(page?: number, limit?: number): Promise<{ data: User[]; total: number }> {
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
    }

    async findOneById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
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
    }

    async deleteById(id: string) : Promise<string> {
        await this.userRepository.delete(id);
        return `User with id ${id} has been deleted`;
    }

    async toggleVerificationBadge(userId: string,dto: ToggleVerificationBadgeDto): Promise<User> {
        const user = await this.userRepository.findOne({where: {id: userId}});
        if(!user) throw new Error('User not found');

        user.verificationBadge = dto.verificationBadge;
        return this.userRepository.save(user);
    }

    async searchByName(name: string): Promise<User[]> {
        return this.userRepository
        .createQueryBuilder('user')
        .where('LOWER(user.name) LIKE :name', { name: `%${name.toLowerCase()}%` })
        .getMany();
    }
}
