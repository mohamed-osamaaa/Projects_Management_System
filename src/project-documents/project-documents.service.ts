import { extname } from 'path';
import { Project } from 'src/entities/project.entity';
import { ProjectDocument } from 'src/entities/projectDocument.entity';
import { User } from 'src/entities/user.entity';
import { CloudinaryService } from 'src/utils/cloudinary/cloudinary.service';
import { Repository } from 'typeorm';

import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateProjectDocumentDto } from './dto/create-project-document.dto';
import { UpdateProjectDocumentDto } from './dto/update-project-document.dto';

@Injectable()
export class ProjectDocumentsService {
    constructor(
        @InjectRepository(ProjectDocument)
        private readonly docRepo: Repository<ProjectDocument>,

        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,

        @InjectRepository(User)
        private readonly userRepo: Repository<User>,

        private readonly cloudinaryService: CloudinaryService
    ) { }



    async create(
        dto: CreateProjectDocumentDto,
        projectId: string,
        uploadedById: string,
        file?: Express.Multer.File
    ): Promise<ProjectDocument> {
        const project = await this.projectRepo.findOne({ where: { id: projectId } });
        if (!project) throw new NotFoundException("Project not found");

        const user = await this.userRepo.findOne({ where: { id: uploadedById } });
        if (!user) throw new NotFoundException("User not found");

        let fileUrl: string | undefined = undefined;
        let fileType: "image" | "pdf" | "video" | "other" = "other";

        if (file) {
            const result = await this.cloudinaryService.uploadFile(file);
            fileUrl = result.secure_url;

            const ext = extname(file.originalname).toLowerCase();
            if ([".png", ".jpg", ".jpeg", ".gif"].includes(ext)) fileType = "image";
            else if (ext === ".pdf") fileType = "pdf";
            else if ([".mp4", ".mov", ".avi"].includes(ext)) fileType = "video";
        }

        const document = this.docRepo.create({
            ...dto,
            fileUrl,
            fileType,
            project,
            uploadedBy: user,
        });

        return this.docRepo.save(document);
    }

    async findAll(projectId: string): Promise<ProjectDocument[]> {
        return this.docRepo.find({
            where: { project: { id: projectId } },
            relations: ["uploadedBy"],
        });
    }

    async findOne(id: string): Promise<ProjectDocument> {
        const doc = await this.docRepo.findOne({
            where: { id },
            relations: ["uploadedBy", "project"],
        });
        if (!doc) throw new NotFoundException("Document not found");
        return doc;
    }

    async findOneForDownload(id: string): Promise<ProjectDocument> {
        const doc = await this.docRepo.findOne({
            where: { id },
        });
        if (!doc) throw new NotFoundException("Document not found");
        return doc;
    }

    async update(
        id: string,
        dto: UpdateProjectDocumentDto,
        userId: string
    ): Promise<ProjectDocument> {
        const doc = await this.findOne(id);

        if (doc.uploadedBy.id !== userId) {
            throw new ForbiddenException("You are not allowed to edit this document");
        }

        Object.assign(doc, dto);
        return this.docRepo.save(doc);
    }

    async remove(id: string, userId: string): Promise<{ message: string }> {
        const doc = await this.findOne(id);

        if (doc.uploadedBy.id !== userId) {
            throw new ForbiddenException("You are not allowed to delete this document");
        }

        if (doc.fileUrl) {
            const urlParts = doc.fileUrl.split('/project_management_system/');
            if (urlParts.length === 2) {
                const fileName = urlParts[1];
                const publicId = `project_management_system/${fileName.split('.').slice(0, -1).join('.')}`;
                try {
                    await this.cloudinaryService.deleteFile(publicId);
                } catch (err) {
                    console.error("Cloudinary delete error:", err);
                }
            }
        }


        await this.docRepo.remove(doc);

        return { message: "Document deleted successfully" };
    }

}
