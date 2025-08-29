import axios from 'axios';
import { Response } from 'express';
import { AuthenticationGuard } from 'src/utils/guards/authentication.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProjectDocumentDto } from './dto/create-project-document.dto';
import { UpdateProjectDocumentDto } from './dto/update-project-document.dto';
import { ProjectDocumentsService } from './project-documents.service';

@Controller("project-documents")
export class ProjectDocumentsController {
  constructor(private readonly projectDocsService: ProjectDocumentsService) { }

  @UseGuards(AuthenticationGuard)
  @Post(":projectId")
  @UseInterceptors(FileInterceptor("file"))
  create(
    @Param("projectId") projectId: string,
    @Body() dto: CreateProjectDocumentDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any
  ) {
    const uploadedById = req.currentUser.id;
    return this.projectDocsService.create(dto, projectId, uploadedById, file);
  }

  @UseGuards(AuthenticationGuard)
  @Get("project/:projectId")
  findAll(@Param("projectId") projectId: string) {
    return this.projectDocsService.findAll(projectId);
  }

  @UseGuards(AuthenticationGuard)
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.projectDocsService.findOne(id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() dto: UpdateProjectDocumentDto,
    @Req() req: any
  ) {
    return this.projectDocsService.update(id, dto, req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard)
  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: any): Promise<{ message: string }> {
    return this.projectDocsService.remove(id, req.currentUser.id);
  }

  @UseGuards(AuthenticationGuard)
  @Get(":id/download")
  async download(@Param("id") id: string, @Res() res: Response) {
    const doc = await this.projectDocsService.findOneForDownload(id);
    if (!doc.fileUrl) throw new NotFoundException("No file attached");

    const response = await axios.get(doc.fileUrl, { responseType: "stream" });

    const urlExt = doc.fileUrl.split(".").pop();
    const safeName = doc.name.includes(".") ? doc.name : `${doc.name}.${urlExt}`;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName}"`
    );

    response.data.pipe(res);
  }
}
