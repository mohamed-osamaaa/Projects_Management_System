import { Test, TestingModule } from '@nestjs/testing';
import { StaticContentController } from './static-content.controller';
import { StaticContentService } from './static-content.service';

describe('StaticContentController', () => {
  let controller: StaticContentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StaticContentController],
      providers: [StaticContentService],
    }).compile();

    controller = module.get<StaticContentController>(StaticContentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
