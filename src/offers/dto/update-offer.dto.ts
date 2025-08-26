import {
    IsOptional,
    IsString,
} from 'class-validator';

export class UpdateOfferDto {
    @IsOptional()
    @IsString()
    description?: string;
}