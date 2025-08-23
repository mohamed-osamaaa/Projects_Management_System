import { UserRole } from 'src/utils/enums/userRoles.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Company } from './company.entity';
import { InspectionAppointment } from './inspectionAppointment.entity';
import { Message } from './message.entity';
import { Notification } from './notification.entity';
import { Project } from './project.entity';
import { ProjectDocument } from './projectDocument.entity';
import { SupportTicket } from './supportTicket.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column({
    type: "enum",
    enum: UserRole
  })
  role: UserRole;

  @Column({
    type: 'boolean',
    default: false,
  })
  verificationBadge: boolean;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  company: Company;

  @OneToMany(() => Project, (project) => project.client)
  projects: Project[];

  @OneToMany(() => Message, (message) => message.sender)
  messages: Message[];

  @OneToMany(() => SupportTicket, (ticket) => ticket.user)
  tickets: SupportTicket[];

  @OneToMany(() => ProjectDocument, (doc) => doc.uploadedBy)
  documents: ProjectDocument[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToMany(() => InspectionAppointment, (inspection) => inspection.engineer)
  inspections: InspectionAppointment[];
}
