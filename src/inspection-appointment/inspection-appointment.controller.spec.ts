import { Test, TestingModule } from '@nestjs/testing';
import { InspectionAppointmentController } from './inspection-appointment.controller';
import { InspectionAppointmentService } from './inspection-appointment.service';

describe('InspectionAppointmentController', () => {
  let controller: InspectionAppointmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InspectionAppointmentController],
      providers: [InspectionAppointmentService],
    }).compile();

    controller = module.get<InspectionAppointmentController>(InspectionAppointmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
