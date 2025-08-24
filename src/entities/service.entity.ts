import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Project } from './project.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @ManyToOne(() => Project, (project) => project.services, { onDelete: "CASCADE" })
  project: Project;
}
