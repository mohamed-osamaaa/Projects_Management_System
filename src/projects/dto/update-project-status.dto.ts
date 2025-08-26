import { IsEnum } from 'class-validator';
import { ProjectStatus } from 'src/utils/enums/projectStatus.enum';

export class UpdateProjectStatusDto {
    @IsEnum(ProjectStatus, { message: 'Status must be a valid ProjectStatus' })
    status: ProjectStatus;
}
