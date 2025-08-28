import { ProjectStatus } from 'src/utils/enums/projectStatus.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Chat } from './chat.entity';
import { InspectionAppointment } from './inspectionAppointment.entity';
import { Milestone } from './milestone.entity';
import { Offer } from './offer.entity';
import { ProjectDocument } from './projectDocument.entity';
import { User } from './user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PENDING,
  })
  status: ProjectStatus;

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

  @OneToOne(() => Chat, (chat) => chat.project)
  chat: Chat;

  @OneToMany(() => ProjectDocument, (doc) => doc.project)
  documents: ProjectDocument[];
}
