import {
    IsEnum,
    IsNotEmpty,
} from 'class-validator';
import { TicketPriority } from 'src/utils/enums/ticketPriority.enum';

export class UpdateTicketPriorityDto {
    @IsNotEmpty()
    @IsEnum(TicketPriority)
    priority: TicketPriority;
}