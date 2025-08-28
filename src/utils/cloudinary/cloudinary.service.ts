import { v2 as cloudinary } from 'cloudinary';
import * as sharp from 'sharp';
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

        const optimizedBuffer = await sharp(file.buffer)
            .resize({ width: 1920, withoutEnlargement: true })
            .jpeg({ quality: 80 })
            .toBuffer();

        return new Promise<CloudinaryResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: '/project_management_system',
                    use_filename: true,
                    unique_filename: false,
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (!result) return reject(new Error('Upload failed, result is undefined'));
                    resolve(result as CloudinaryResponse);
                },
            );

            streamifier.createReadStream(optimizedBuffer).pipe(uploadStream);
        });
    }
}
