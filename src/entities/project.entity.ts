import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Chat } from './chat.entity';
import { InspectionAppointment } from './inspectionAppointment.entity';
import { Milestone } from './milestone.entity';
import { Offer } from './offer.entity';
import { ProjectDocument } from './projectDocument.entity';
import { Service } from './service.entity';
import { Stage } from './stage.entity';
import { User } from './user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({ default: "pending" })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  totalBudget: number;

  @ManyToOne(() => User, (user) => user.projects)
  client: User;

  @OneToMany(() => Offer, (offer) => offer.project)
  offers: Offer[];

  @OneToMany(() => Milestone, (milestone) => milestone.project)
  milestones: Milestone[];

  @OneToMany(() => InspectionAppointment, (inspection) => inspection.project)
  inspections: InspectionAppointment[];

  @OneToMany(() => Chat, (chat) => chat.project)
  chats: Chat[];

  @OneToMany(() => ProjectDocument, (doc) => doc.project)
  documents: ProjectDocument[];

  @OneToMany(() => Stage, (stage) => stage.project)
  stages: Stage[];

  @OneToMany(() => Service, (service) => service.project)
  services: Service[];
}
