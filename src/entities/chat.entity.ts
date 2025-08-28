import {
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Message } from './message.entity';
import { Project } from './project.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Project, (project) => project.chat, { onDelete: 'CASCADE' })
  @JoinColumn()
  project: Project;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
