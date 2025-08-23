import { MilestoneStatus } from 'src/utils/enums/milestoneStatus.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Payment } from './payment.entity';
import { Project } from './project.entity';

@Entity()
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    default: MilestoneStatus.DELAYED,
  })
  status: MilestoneStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Project, (project) => project.milestones)
  project: Project;

  @OneToMany(() => Payment, (payment) => payment.milestone)
  payments: Payment[];
}
