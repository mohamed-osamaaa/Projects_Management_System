import { Project } from 'src/entities/project.entity';
import { ProjectDocument } from 'src/entities/projectDocument.entity';
import { User } from 'src/entities/user.entity';
import { CloudinaryModule } from 'src/utils/cloudinary/cloudinary.module';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectDocumentsController } from './project-documents.controller';
import { ProjectDocumentsService } from './project-documents.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProjectDocument,
      Project,
      User
    ]),
    CloudinaryModule
  ],
  controllers: [ProjectDocumentsController],
  providers: [ProjectDocumentsService],
})
export class ProjectDocumentsModule { }
