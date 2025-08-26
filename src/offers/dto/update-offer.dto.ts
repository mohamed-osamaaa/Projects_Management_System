import {
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';

export class UpdateOfferDto {
    @IsOptional()
    @IsNumber()
    @Min(0)
    price?: number;

    @IsOptional()
    @IsString()
    description?: string;
}