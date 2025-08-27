import {
    IsDateString,
    IsNotEmpty,
    IsUUID,
} from 'class-validator';

export class CreateInspectionDto {
    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsNotEmpty()
    @IsUUID()
    companyId: string;
}
