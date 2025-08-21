import { InspectionStatus } from 'src/utils/enums/inspectionAppointment.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Company } from './company';
import { Project } from './project';
import { User } from './user';

@Entity()
export class InspectionAppointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.PENDING,
  })
  status: InspectionStatus;

  @ManyToOne(() => Project, (project) => project.inspections)
  project: Project;

  @ManyToOne(() => Company, { nullable: true })
  company: Company;

  @ManyToOne(() => User, { nullable: true })
  engineer: User;
}