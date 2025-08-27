import { Test, TestingModule } from '@nestjs/testing';
import { InspectionAppointmentService } from './inspection-appointment.service';

describe('InspectionAppointmentService', () => {
  let service: InspectionAppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InspectionAppointmentService],
    }).compile();

    service = module.get<InspectionAppointmentService>(InspectionAppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
