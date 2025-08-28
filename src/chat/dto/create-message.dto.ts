import { IsOptional } from 'class-validator';

export class CreateMessageDto {
    @IsOptional()
    content: string;

}
