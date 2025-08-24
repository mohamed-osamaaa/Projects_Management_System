import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Project } from './project.entity';

@Entity()
export class Stage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @ManyToOne(() => Project, (project) => project.stages, { onDelete: "CASCADE" })
  project: Project;
}
