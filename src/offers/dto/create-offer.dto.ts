import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class CreateOfferDto {
    @IsString()
    @IsNotEmpty()
    description: string;
}