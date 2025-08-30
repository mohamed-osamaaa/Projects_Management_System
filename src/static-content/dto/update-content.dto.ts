import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class UpdateContentDto {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsString()
    content: string;
}
