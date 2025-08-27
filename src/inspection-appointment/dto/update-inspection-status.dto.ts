import { IsEnum } from 'class-validator';
import { InspectionStatus } from 'src/utils/enums/inspectionAppointment.enum';

export class UpdateInspectionStatusDto {
    @IsEnum(InspectionStatus)
    status: InspectionStatus;
}