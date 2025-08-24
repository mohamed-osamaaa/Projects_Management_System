import {
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Message } from './message.entity';
import { Project } from './project.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Project, (project) => project.chats)
  project: Project;

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[];
}
