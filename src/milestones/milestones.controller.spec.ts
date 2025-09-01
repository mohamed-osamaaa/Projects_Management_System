import {
    Test,
    TestingModule,
} from '@nestjs/testing';

import { MilestonesController } from './milestones.controller';
import { MilestonesService } from './milestones.service';

describe('MilestonesController', () => {
    let controller: MilestonesController;
    let service: MilestonesService;

    const mockService = {
        create: jest.fn(),
        findAllByProject: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        updateStatus: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MilestonesController],
            providers: [
                { provide: MilestonesService, useValue: mockService },
            ],
        }).compile();

        controller = module.get<MilestonesController>(MilestonesController);
        service = module.get<MilestonesService>(MilestonesService);
    });

    it('should call service.create on create()', async () => {
        const dto = { title: 'M1' } as any;
        const result = { id: 'm1', title: 'M1' };
        mockService.create.mockResolvedValue(result);

        const req = { currentUser: { id: 'owner1' } };
        const response = await controller.create('p1', dto, req);

        expect(service.create).toHaveBeenCalledWith('p1', 'owner1', dto);
        expect(response).toEqual(result);
    });

    it('should call service.findAllByProject on findAllByProject()', async () => {
        const milestones = [{ id: 'm1' }];
        mockService.findAllByProject.mockResolvedValue(milestones);

        const response = await controller.findAllByProject('p1');

        expect(service.findAllByProject).toHaveBeenCalledWith('p1');
        expect(response).toEqual(milestones);
    });

    it('should call service.remove on remove()', async () => {
        const result = { message: 'deleted' };
        mockService.remove.mockResolvedValue(result);

        const response = await controller.remove('m1');

        expect(service.remove).toHaveBeenCalledWith('m1');
        expect(response).toEqual(result);
    });
});
