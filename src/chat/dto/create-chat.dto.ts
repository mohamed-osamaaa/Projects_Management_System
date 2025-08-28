import { IsUUID } from 'class-validator';

export class CreateChatDto {
    @IsUUID()
    projectId: string;
}
