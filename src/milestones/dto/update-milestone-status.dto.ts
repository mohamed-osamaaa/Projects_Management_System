import {
    IsEnum,
    IsNotEmpty,
} from 'class-validator';
import { MilestoneStatus } from 'src/utils/enums/milestoneStatus.enum';

export class UpdateMilestoneStatusDto {
    @IsEnum(MilestoneStatus)
    @IsNotEmpty()
    milestoneStatus: MilestoneStatus;
}
