import {
    IsDateString,
    IsNotEmpty,
} from 'class-validator';

export class RepublishProjectDto {
    @IsNotEmpty()
    @IsDateString()
    deadline: string;
}
