import {
    IsDateString,
    IsOptional,
    IsUUID,
} from 'class-validator';

export class UpdateInspectionDto {
    @IsDateString()
    @IsOptional()
    date?: Date;


    @IsOptional()
    @IsUUID()
    companyId: string;
}