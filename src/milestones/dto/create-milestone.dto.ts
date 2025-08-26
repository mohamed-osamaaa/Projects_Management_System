import {
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator';

export class CreateMilestoneDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    amount: number;

}
