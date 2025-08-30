import { IsNotEmpty } from 'class-validator';

export class UpdateTicketStatusDto {
    @IsNotEmpty()
    status: string;
}
