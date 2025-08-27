import * as bcrypt from 'bcrypt';
import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { UserRole } from 'src/utils/enums/userRoles.enum';
import { Repository } from 'typeorm';

import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateEngineerDto } from './dto/create-engineer.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepo: Repository<Company>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async findAll(): Promise<Company[]> {
        try {
            return await this.companyRepo.find();
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async findOne(id: string): Promise<Company> {
        try {
            const company = await this.companyRepo.findOne({
                where: { id },
                relations: ['engineers', 'offers', 'owner'],
            });

            if (!company) {
                throw new NotFoundException(`Company ${id} not found`);
            }

            return company;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async create(dto: CreateCompanyDto): Promise<Company> {
        try {
            const hashedPassword = await bcrypt.hash(dto.userPassword, 10);

            const user = this.userRepo.create({
                name: dto.userName,
                email: dto.userEmail,
                password: hashedPassword,
                role: UserRole.COMPANY,
            });

            const savedUser = await this.userRepo.save(user);

            const company = this.companyRepo.create({
                name: dto.name,
                description: dto.description,
                address: dto.address,
                phone: dto.phone,
                paymentAccountId: dto.paymentAccountId,
                owner: savedUser,
            });

            await this.companyRepo.save(company);

            savedUser.company = company;
            await this.userRepo.save(savedUser);

            return company;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async update(id: string, dto: UpdateCompanyDto): Promise<Company> {
        try {
            const company = await this.companyRepo.findOne({ where: { id } });
            if (!company) throw new NotFoundException(`Company ${id} not found`);

            Object.assign(company, dto);
            return await this.companyRepo.save(company);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async remove(id: string): Promise<{ message: string }> {
        try {
            const company = await this.companyRepo.findOne({ where: { id } });
            if (!company) throw new NotFoundException(`Company ${id} not found`);

            await this.companyRepo.remove(company);
            return { message: `Company ${id} deleted successfully` };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }


    async findEngineers(companyId: string): Promise<User[]> {
        try {
            const company = await this.companyRepo.findOne({
                where: { id: companyId },
                relations: ['engineers'],
            });
            if (!company) throw new NotFoundException(`Company ${companyId} not found`);

            return company.engineers.filter((u) => u.role === UserRole.ENGINEER);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async addEngineer(companyId: string, dto: CreateEngineerDto): Promise<User> {
        try {
            const company = await this.companyRepo.findOne({ where: { id: companyId } });
            if (!company) throw new NotFoundException(`Company ${companyId} not found`);

            const hashedPassword = await bcrypt.hash(dto.password, 10);
            const engineer = this.userRepo.create({
                ...dto,
                password: hashedPassword,
                role: UserRole.ENGINEER,
                company,
            });

            return await this.userRepo.save(engineer);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }



    async removeEngineer(companyId: string, engineerId: string): Promise<{ message: string }> {
        try {
            const company = await this.companyRepo.findOne({
                where: { id: companyId },
                relations: ['engineers', 'owner'],
            });

            if (!company) throw new NotFoundException(`Company ${companyId} not found`);

            const engineer = await this.userRepo.findOne({ where: { id: engineerId, role: UserRole.ENGINEER } });
            if (!engineer) throw new NotFoundException(`Engineer ${engineerId} not found`);

            if (!company.engineers.some((e) => e.id === engineer.id)) {
                throw new NotFoundException(`Engineer ${engineerId} does not belong to this company`);
            }

            await this.userRepo.remove(engineer);

            return { message: `Engineer ${engineerId} removed successfully from company ${companyId}` };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }


}