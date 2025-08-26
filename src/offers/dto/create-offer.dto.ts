import {
    IsNotEmpty,
    IsNumber,
    IsString,
    Min,
} from 'class-validator';

export class CreateOfferDto {
    @IsNumber()
    @Min(0)
    price: number;

    @IsString()
    @IsNotEmpty()
    description: string;
}