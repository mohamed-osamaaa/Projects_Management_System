import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';

import { CloudinaryResponse } from './cloudinary-response';

@Injectable()
export class CloudinaryService {
    async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
        if (!file || !file.buffer) {
            throw new BadRequestException('File or file buffer is missing');
        }

        const originalName = file.originalname.split('.').slice(0, -1).join('.');
        const extension = file.originalname.split('.').pop();
        const timestamp = Date.now();
        const publicId = `${originalName}_${timestamp}.${extension}`;

        // const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'];
        // const isImage = extension ? imageExtensions.includes(extension.toLowerCase()) : false;
        // const resourceType = isImage ? 'image' : 'raw';


        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'raw',
                    folder: '/project_management_system',
                    use_filename: true,
                    unique_filename: false,
                    public_id: publicId,
                    type: 'upload',
                    upload_preset: 'project_management_system',
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed, result is undefined'));
                    resolve(result as CloudinaryResponse);
                },
            );

            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }

    async deleteFile(publicId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, { resource_type: 'raw' }, (error, result) => {
                if (error) return reject(error);
                resolve();
            });
        });
    }

}