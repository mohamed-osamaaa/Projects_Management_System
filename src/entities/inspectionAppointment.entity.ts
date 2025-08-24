import { InspectionStatus } from 'src/utils/enums/inspectionAppointment.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Company } from './company.entity';
import { Project } from './project.entity';
import { User } from './user.entity';

@Entity()
export class InspectionAppointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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