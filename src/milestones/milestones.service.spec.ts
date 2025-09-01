import { Company } from 'src/entities/company.entity';
import { Milestone } from 'src/entities/milestone.entity';
import { Project } from 'src/entities/project.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { Repository } from 'typeorm';

import { InternalServerErrorException } from '@nestjs/common';
import {
    Test,
    TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MilestonesService } from './milestones.service';

const mockMilestoneRepo = () => ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    preload: jest.fn(),
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

describe('MilestonesService', () => {
    let service: MilestonesService;
    let milestoneRepo: jest.Mocked<Repository<Milestone>>;
    let projectRepo: jest.Mocked<Repository<Project>>;
    let companyRepo: jest.Mocked<Repository<Company>>;
    let notificationsService: jest.Mocked<NotificationsService>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MilestonesService,
                { provide: getRepositoryToken(Milestone), useFactory: mockMilestoneRepo },
                { provide: getRepositoryToken(Project), useFactory: mockProjectRepo },
                { provide: getRepositoryToken(Company), useFactory: mockCompanyRepo },
                { provide: NotificationsService, useFactory: mockNotificationsService },
            ],
        }).compile();

        service = module.get<MilestonesService>(MilestonesService);
        milestoneRepo = module.get(getRepositoryToken(Milestone));
        projectRepo = module.get(getRepositoryToken(Project));
        companyRepo = module.get(getRepositoryToken(Company));
        notificationsService = module.get(NotificationsService);
    });

    describe('create', () => {
        it('should create and return milestone', async () => {
            const project = { id: 'p1', client: { id: 'c1' } } as Project;
            const company = { id: 'comp1' } as Company;
            const dto = { title: 'M1' } as any;
            const milestone = { id: 'm1', ...dto } as Milestone;

            projectRepo.findOne.mockResolvedValue(project);
            companyRepo.findOne.mockResolvedValue(company);
            milestoneRepo.create.mockReturnValue(milestone);
            milestoneRepo.save.mockResolvedValue(milestone);

            const result = await service.create('p1', 'owner1', dto);

            expect(projectRepo.findOne).toHaveBeenCalledWith({ where: { id: 'p1' } });
            expect(companyRepo.findOne).toHaveBeenCalledWith({ where: { owner: { id: 'owner1' } } });
            expect(milestoneRepo.create).toHaveBeenCalledWith({ ...dto, project, company });
            expect(milestoneRepo.save).toHaveBeenCalledWith(milestone);
            expect(notificationsService.createNotification).toHaveBeenCalledWith(
                'c1',
                'تمت إضافة معلم جديد لمشروعك.'
            );
            expect(result).toEqual(milestone);
        });

        it('should throw InternalServerErrorException if create fails', async () => {
            projectRepo.findOne.mockResolvedValue(null);

            await expect(service.create('p1', 'owner1', {} as any)).rejects.toThrow(InternalServerErrorException);
        });
    });

    describe('findOne', () => {
        it('should return milestone if found', async () => {
            const milestone = { id: 'm1' } as Milestone;
            milestoneRepo.findOne.mockResolvedValue(milestone);

            const result = await service.findOne('m1');

            expect(result).toEqual(milestone);
        });

        it('should throw InternalServerErrorException if findOne fails', async () => {
            milestoneRepo.findOne.mockResolvedValue(null);

            await expect(service.findOne('m1')).rejects.toThrow(InternalServerErrorException);
        });
    });
});
