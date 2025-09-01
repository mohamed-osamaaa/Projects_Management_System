import { Offer } from 'src/entities/offer.entity';

import {
    Test,
    TestingModule,
} from '@nestjs/testing';

import { OffersController } from './offers.controller';
import { OffersService } from './offers.service';

describe('OffersController', () => {
    let controller: OffersController;
    let service: OffersService;

    const mockOffersService = {
        create: jest.fn(),
        findOne: jest.fn(),
        updateStatus: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
        findMyOffers: jest.fn(),
        findByStatus: jest.fn(),
        getOffersByProjectId: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [OffersController],
            providers: [
                { provide: OffersService, useValue: mockOffersService },
            ],
        }).compile();

        controller = module.get<OffersController>(OffersController);
        service = module.get<OffersService>(OffersService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call service.create in createOffer', async () => {
        const mockOffer = { id: 'o1' } as Offer;
        mockOffersService.create.mockResolvedValue(mockOffer);

        const result = await controller.createOffer('p1', { price: 1000 } as any, { currentUser: { id: 'u1' } });
        expect(service.create).toHaveBeenCalledWith('p1', { price: 1000 }, 'u1');
        expect(result).toEqual(mockOffer);
    });

    it('should call service.findOne in getOffer', async () => {
        const mockOffer = { id: 'o1' } as Offer;
        mockOffersService.findOne.mockResolvedValue(mockOffer);

        const result = await controller.getOffer('o1');
        expect(service.findOne).toHaveBeenCalledWith('o1');
        expect(result).toEqual(mockOffer);
    });
});
