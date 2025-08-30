import { StaticContent } from 'src/entities/staticContent.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ContentController } from './static-content.controller';
import { ContentService } from './static-content.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StaticContent]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class StaticContentModule { }
