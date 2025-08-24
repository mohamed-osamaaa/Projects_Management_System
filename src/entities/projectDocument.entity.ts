import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Project } from './project.entity';
import { User } from './user.entity';

@Entity()
export class ProjectDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 255 })
  fileUrl: string;

  @Column({
    type: "enum",
    enum: ["image", "pdf", "video", "other"],
    default: "other",
  })
  fileType: "image" | "pdf" | "video" | "other";

  @CreateDateColumn()
  uploadedAt: Date;

  @ManyToOne(() => Project, (project) => project.documents, {
    onDelete: "CASCADE",
  })
  project: Project;

  @ManyToOne(() => User, (user) => user.documents)
  uploadedBy: User;
}