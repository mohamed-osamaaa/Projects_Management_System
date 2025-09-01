import { Company } from 'src/entities/company.entity';
import { Offer } from 'src/entities/offer.entity';
import { Project } from 'src/entities/project.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';

import { InternalServerErrorException } from '@nestjs/common';
import {
    Test,
    TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { OffersService } from './offers.service';

const mockOfferRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
});

const mockProjectRepo = () => ({
    findOne: jest.fn(),
});

const mockCompanyRepo = () => ({
    findOne: jest.fn(),
});

const mockNotificationsService = () => ({
    createNotification: jest.fn(),
});

describe('OffersService', () => {
    let service: OffersService;
    let offerRepo: jest.Mocked<Repository<Offer>>;
    let projectRepo: jest.Mocked<Repository<Project>>;
    let companyRepo: jest.Mocked<Repository<Company>>;
    let notificationsService: NotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OffersService,
                { provide: getRepositoryToken(Offer), useFactory: mockOfferRepo },
                { provide: getRepositoryToken(Project), useFactory: mockProjectRepo },
                { provide: getRepositoryToken(Company), useFactory: mockCompanyRepo },
                { provide: NotificationsService, useFactory: mockNotificationsService },
            ],
        }).compile();

        service = module.get<OffersService>(OffersService);
        offerRepo = module.get(getRepositoryToken(Offer));
        projectRepo = module.get(getRepositoryToken(Project));
        companyRepo = module.get(getRepositoryToken(Company));
        notificationsService = module.get<NotificationsService>(NotificationsService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create and save an offer', async () => {
            const mockProject = { id: 'p1', client: { id: 'c1' }, title: 'Test Project' } as Project;
            const mockCompany = { id: 'co1' } as Company;
            const mockOffer = { id: 'o1', project: mockProject, company: mockCompany } as Offer;

            projectRepo.findOne.mockResolvedValue(mockProject);
            companyRepo.findOne.mockResolvedValue(mockCompany);
            offerRepo.create.mockReturnValue(mockOffer);
            offerRepo.save.mockResolvedValue(mockOffer);

            const dto = { price: 1000 } as any;

            const result = await service.create('p1', dto, 'user1');

            expect(projectRepo.findOne).toHaveBeenCalledWith({ where: { id: 'p1' } });
            expect(companyRepo.findOne).toHaveBeenCalled();
            expect(offerRepo.create).toHaveBeenCalledWith({ ...dto, project: mockProject, company: mockCompany });
            expect(offerRepo.save).toHaveBeenCalledWith(mockOffer);
            expect(notificationsService.createNotification).toHaveBeenCalledWith(
                'c1',
                expect.any(String),
            );
            expect(result).toEqual(mockOffer);
        });

        it('should throw InternalServerErrorException if create fails', async () => {
            projectRepo.findOne.mockResolvedValue(null);
            await expect(service.create('p1', {} as any, 'u1')).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return offer if found', async () => {
            const mockOffer = { id: 'o1' } as Offer;
            offerRepo.findOne.mockResolvedValue(mockOffer);

            const result = await service.findOne('o1');
            expect(result).toEqual(mockOffer);
        });

        it('should throw InternalServerErrorException if findOne fails', async () => {
            offerRepo.findOne.mockResolvedValue(null);
            await expect(service.findOne('o1')).rejects.toThrow(InternalServerErrorException);
        });
    });
});
