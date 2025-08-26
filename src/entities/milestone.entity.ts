import { MilestoneStatus } from 'src/utils/enums/milestoneStatus.enum';
import { PaymentStatus } from 'src/utils/enums/paymentStatus.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Company } from './company.entity';
import { Payment } from './payment.entity';
import { Project } from './project.entity';

@Entity()
export class Milestone {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column({
    type: 'enum',
    enum: MilestoneStatus,
    default: MilestoneStatus.PENDING,
  })
  milestoneStatus: MilestoneStatus;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.DELAYED,
  })
  paymentStatus: PaymentStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ManyToOne(() => Project, (project) => project.milestones)
  project: Project;

  @ManyToOne(() => Company, (company) => company.milestones, { nullable: true })
  company: Company;

  @OneToMany(() => Payment, (payment) => payment.milestone)
  payments: Payment[];

}
