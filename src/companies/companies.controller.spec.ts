import { Company } from 'src/entities/company.entity';
import { UserRole } from 'src/utils/enums/userRoles.enum';

import { ForbiddenException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findEngineers: jest.fn(),
    addEngineer: jest.fn(),
    removeEngineer: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [{ provide: CompaniesService, useValue: mockService }],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all companies', async () => {
    const companies = [{ id: '1', name: 'Test Company' }] as Company[];
    mockService.findAll.mockResolvedValue(companies);

    const result = await controller.getCompanies();
    expect(result).toEqual(companies);
    expect(mockService.findAll).toHaveBeenCalled();
  });

  it('should throw ForbiddenException if user not owner or admin when updating', async () => {
    const company = { id: '1', owner: { id: '2' } } as Company;
    const dto = { name: 'Updated' };
    const req = { currentUser: { id: '3', role: UserRole.COMPANY } };

    mockService.findOne.mockResolvedValue(company);

    await expect(controller.updateCompany('1', dto, req)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('should call remove on service when deleting company', async () => {
    mockService.remove.mockResolvedValue({ message: 'deleted' });

    const result = await controller.deleteCompany('1');
    expect(result).toEqual({ message: 'deleted' });
    expect(mockService.remove).toHaveBeenCalledWith('1');
  });
});
