import { StaticContent } from 'src/entities/staticContent.entity';
import { Repository } from 'typeorm';

import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class ContentService {
    constructor(
        @InjectRepository(StaticContent)
        private readonly contentRepo: Repository<StaticContent>,
    ) { }

    async findAll(): Promise<StaticContent[]> {
        return this.contentRepo.find();
    }

    async findByType(type: string): Promise<StaticContent> {
        const normalizedType = type.toLowerCase();
        const content = await this.contentRepo.findOne({
            where: { type: normalizedType }
        });
        if (!content) throw new NotFoundException(`Content with type "${type}" not found`);
        return content;
    }


    async create(dto: CreateContentDto): Promise<StaticContent> {
        const content = this.contentRepo.create({
            ...dto,
            type: dto.type.toLowerCase()
        });
        return this.contentRepo.save(content);
    }

    async update(id: string, dto: UpdateContentDto): Promise<StaticContent> {
        const content = await this.contentRepo.findOne({ where: { id } });
        if (!content) throw new NotFoundException(`Content with id "${id}" not found`);

        if (dto.type) dto.type = dto.type.toLowerCase();
        Object.assign(content, dto);
        return this.contentRepo.save(content);
    }


    async remove(id: string): Promise<{ message: string }> {
        const result = await this.contentRepo.delete(id);
        if (!result.affected) throw new NotFoundException(`Content with id "${id}" not found`);
        return { message: 'Content deleted successfully' };
    }
}
