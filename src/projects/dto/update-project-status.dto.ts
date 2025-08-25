import { IsString } from 'class-validator';

export class UpdateProjectStatusDto {
    @IsString()
    status: string;
}
