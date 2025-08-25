import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
} from 'class-validator';

export class CreateProjectDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsDateString()
    deadline?: Date;

    @IsOptional()
    @IsNumber()
    totalBudget?: number;
}
