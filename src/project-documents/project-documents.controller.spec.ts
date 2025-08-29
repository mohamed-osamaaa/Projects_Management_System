import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDocumentsController } from './project-documents.controller';
import { ProjectDocumentsService } from './project-documents.service';

describe('ProjectDocumentsController', () => {
  let controller: ProjectDocumentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDocumentsController],
      providers: [ProjectDocumentsService],
    }).compile();

    controller = module.get<ProjectDocumentsController>(ProjectDocumentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
