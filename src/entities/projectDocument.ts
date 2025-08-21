import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Project } from './project';
import { User } from './user';

@Entity()
export class ProjectDocument {
  @PrimaryGeneratedColumn()
  id: number;

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