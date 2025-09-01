import { ProjectStatus } from 'src/utils/enums/projectStatus.enum';
import { UserRole } from 'src/utils/enums/userRoles.enum';

import { ForbiddenException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';

const mockProject = {
  id: 'p1',
  title: 'Test Project',
  status: ProjectStatus.PENDING,
  client: { id: 'c1' },
};

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let service: ProjectsService;

  const mockProjectsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findClientProjects: jest.fn(),
    findCompanyProjects: jest.fn(),
    findEngineerProjects: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
    republish: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    controller = module.get<ProjectsController>(ProjectsController);
    service = module.get<ProjectsService>(ProjectsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create project if user is client', async () => {
      mockProjectsService.create.mockResolvedValue(mockProject);

      const req = { currentUser: { id: 'c1', role: UserRole.CLIENT } };
      const result = await controller.createProject({ title: 'Test Project' } as any, req);

      expect(service.create).toHaveBeenCalledWith({ title: 'Test Project' }, 'c1');
      expect(result).toEqual(mockProject);
    });

    it('should throw ForbiddenException if user is not client', async () => {
      const req = { currentUser: { id: 'x1', role: UserRole.ADMIN } };
      await expect(controller.createProject({ title: 'T' } as any, req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getProjects', () => {
    it('should return list of projects', async () => {
      mockProjectsService.findAll.mockResolvedValue([mockProject]);

      const result = await controller.getProjects('PENDING', 'c1', undefined, undefined, undefined, 1, 10);

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual([mockProject]);
    });
  });

  describe('getMyProjects', () => {
    it('should return client projects', async () => {
      mockProjectsService.findClientProjects.mockResolvedValue([mockProject]);

      const req = { currentUser: { id: 'c1', role: UserRole.CLIENT } };
      const result = await controller.getMyProjects(req);

      expect(service.findClientProjects).toHaveBeenCalledWith('c1');
      expect(result).toEqual([mockProject]);
    });

    it('should throw ForbiddenException if role not supported', async () => {
      const req = { currentUser: { id: 'x1', role: UserRole.ADMIN } };
      await expect(controller.getMyProjects(req)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getProject', () => {
    it('should return project by id', async () => {
      mockProjectsService.findOne.mockResolvedValue(mockProject);

      const result = await controller.getProject('p1');

      expect(service.findOne).toHaveBeenCalledWith('p1');
      expect(result).toEqual(mockProject);
    });
  });

  describe('updateProject', () => {
    it('should update project', async () => {
      const updated = { ...mockProject, title: 'Updated' };
      mockProjectsService.update.mockResolvedValue(updated);

      const req = { currentUser: { id: 'c1', role: UserRole.CLIENT } };
      const result = await controller.updateProject('p1', { title: 'Updated' } as any, req);

      expect(service.update).toHaveBeenCalledWith('p1', { title: 'Updated' }, 'c1', UserRole.CLIENT);
      expect(result).toEqual(updated);
    });
  });

  describe('updateProjectStatus', () => {
    it('should update status', async () => {
      const updated = { ...mockProject, status: ProjectStatus.IN_PROGRESS };
      mockProjectsService.updateStatus.mockResolvedValue(updated);

      const result = await controller.updateProjectStatus('p1', { status: ProjectStatus.IN_PROGRESS });

      expect(service.updateStatus).toHaveBeenCalledWith('p1', { status: ProjectStatus.IN_PROGRESS });
      expect(result.status).toBe(ProjectStatus.IN_PROGRESS);
    });
  });

  describe('removeProject', () => {
    it('should remove project', async () => {
      mockProjectsService.remove.mockResolvedValue({ message: 'Project deleted successfully' });

      const req = { currentUser: { id: 'c1', role: UserRole.CLIENT } };
      const result = await controller.removeProject('p1', req);

      expect(service.remove).toHaveBeenCalledWith('p1', 'c1', UserRole.CLIENT);
      expect(result).toEqual({ message: 'Project deleted successfully' });
    });
  });

  describe('republishProject', () => {
    it('should republish project', async () => {
      const republished = { ...mockProject, status: ProjectStatus.PENDING };
      mockProjectsService.republish.mockResolvedValue(republished);

      const req = { currentUser: { id: 'c1', role: UserRole.CLIENT } };
      const result = await controller.republishProject('p1', { deadline: '2025-12-31' } as any, req);

      expect(service.republish).toHaveBeenCalledWith('p1', 'c1', '2025-12-31');
      expect(result).toEqual(republished);
    });
  });
});
