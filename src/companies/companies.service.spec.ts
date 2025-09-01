import { Company } from 'src/entities/company.entity';
import { User } from 'src/entities/user.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';

import { InternalServerErrorException } from '@nestjs/common';
import {
    Test,
    TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { CompaniesService } from './companies.service';

describe('CompaniesService', () => {
    let service: CompaniesService;
    let companyRepo: Repository<Company>;
    let userRepo: Repository<User>;
    let notificationsService: NotificationsService;

    const mockCompanyRepo = {
        find: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        remove: jest.fn(),
    };

    const mockUserRepo = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        remove: jest.fn(),
    };

    const mockNotificationsService = {
        createNotification: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CompaniesService,
                { provide: getRepositoryToken(Company), useValue: mockCompanyRepo },
                { provide: getRepositoryToken(User), useValue: mockUserRepo },
                { provide: NotificationsService, useValue: mockNotificationsService },
            ],
        }).compile();

        service = module.get<CompaniesService>(CompaniesService);
        companyRepo = module.get(getRepositoryToken(Company));
        userRepo = module.get(getRepositoryToken(User));
        notificationsService = module.get<NotificationsService>(NotificationsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return all companies', async () => {
        const companies = [{ id: '1', name: 'Test Company' }] as Company[];
        mockCompanyRepo.find.mockResolvedValue(companies);

        const result = await service.findAll();
        expect(result).toEqual(companies);
        expect(mockCompanyRepo.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException if findOne fails', async () => {
        mockCompanyRepo.findOne.mockResolvedValue(null);

        await expect(service.findOne('1')).rejects.toThrow(InternalServerErrorException);
    });

    it('should delete a company', async () => {
        const company = { id: '1', name: 'Test Company' } as Company;
        mockCompanyRepo.findOne.mockResolvedValue(company);
        mockCompanyRepo.remove.mockResolvedValue(company);

        const result = await service.remove('1');
        expect(result).toEqual({ message: `Company 1 deleted successfully` });
    });
});
