import { Project } from 'src/entities/project.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { ProjectStatus } from 'src/utils/enums/projectStatus.enum';
import { UserRole } from 'src/utils/enums/userRoles.enum';
import {
  ObjectLiteral,
  Repository,
} from 'typeorm';

import {
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ProjectsService } from './projects.service';

type MockRepo<T extends ObjectLiteral = any> = {
  [P in keyof Repository<T>]: jest.Mock;
};


const mockProject = {
  id: 'p1',
  title: 'Test Project',
  status: ProjectStatus.PENDING,
  client: { id: 'c1' },
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repo: MockRepo<Project>;
  let notificationsService: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: NotificationsService,
          useValue: {
            createNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repo = module.get(getRepositoryToken(Project));
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  describe('create', () => {
    it('should create and save a project, and send notification', async () => {
      repo.create.mockReturnValue(mockProject);
      repo.save.mockResolvedValue(mockProject);

      const result = await service.create({ title: 'Test Project' } as any, 'c1');

      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalledWith(mockProject);
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        'c1',
        'تم إنشاء مشروعك الجديد.',
      );
      expect(result).toEqual(mockProject);
    });
  });

  describe('findOne', () => {
    it('should return project if found', async () => {
      repo.findOne.mockResolvedValue(mockProject);

      const result = await service.findOne('p1');
      expect(result).toEqual(mockProject);
    });

    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findOne('p1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should update project status', async () => {
      const dto = { status: ProjectStatus.IN_PROGRESS };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProject as any);
      repo.save.mockResolvedValue({ ...mockProject, status: dto.status });

      const result = await service.updateStatus('p1', dto);

      expect(result.status).toBe(ProjectStatus.IN_PROGRESS);
      expect(repo.save).toHaveBeenCalledWith({ ...mockProject, status: dto.status });
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        mockProject.client.id,
        `تم تحديث حالة المشروع إلى ${dto.status}.`,
      );
    });

    it('should throw InternalServerErrorException if updateStatus fails', async () => {
      const dto = { status: 'INVALID' as any };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProject as any);

      await expect(service.updateStatus('p1', dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should allow admin to update project', async () => {
      repo.findOne.mockResolvedValue(mockProject);
      repo.save.mockResolvedValue({ ...mockProject, title: 'Updated' });

      const result = await service.update('p1', { title: 'Updated' } as any, 'anyClient', UserRole.ADMIN);

      expect(result.title).toBe('Updated');
    });

    it('should allow client owner to update project', async () => {
      repo.findOne.mockResolvedValue(mockProject);
      repo.save.mockResolvedValue({ ...mockProject, title: 'Updated' });

      const result = await service.update('p1', { title: 'Updated' } as any, 'c1', UserRole.CLIENT);

      expect(result.title).toBe('Updated');
    });

    it('should throw ForbiddenException if not owner and not admin', async () => {
      repo.findOne.mockResolvedValue(mockProject);

      await expect(
        service.update('p1', { title: 'Updated' } as any, 'c2', UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove project if admin', async () => {
      repo.findOne.mockResolvedValue(mockProject);
      repo.remove.mockResolvedValue(mockProject);

      const result = await service.remove('p1', 'anyClient', UserRole.ADMIN);

      expect(result).toEqual({ message: 'Project deleted successfully' });
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        mockProject.client.id,
        'تم حذف المشروع بواسطة الادمن.',
      );
    });

    it('should remove project if client owner', async () => {
      repo.findOne.mockResolvedValue(mockProject);
      repo.remove.mockResolvedValue(mockProject);

      const result = await service.remove('p1', 'c1', UserRole.CLIENT);

      expect(result).toEqual({ message: 'Project deleted successfully' });
      expect(notificationsService.createNotification).toHaveBeenCalledWith(
        mockProject.client.id,
        'تم حذف مشروعك بنجاح.',
      );
    });

    it('should throw ForbiddenException if not owner and not admin', async () => {
      repo.findOne.mockResolvedValue(mockProject);

      await expect(service.remove('p1', 'c2', UserRole.CLIENT)).rejects.toThrow(ForbiddenException);
    });
  });
});
