import { PaymentStatus } from 'src/utils/enums/paymentStatus.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Company } from './company.entity';
import { Milestone } from './milestone.entity';
import { User } from './user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.DELAYED,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  transactionId: string;

  @Column({ nullable: true })
  provider: string; // ex: Stripe, PayPal ...

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @ManyToOne(() => Milestone, (milestone) => milestone.payments)
  milestone: Milestone;

  @ManyToOne(() => User, (user) => user.paymentsMade, { nullable: false })
  paymentBy: User;

  @ManyToOne(() => Company, (company) => company.paymentsReceived, { nullable: false })
  paymentTo: Company;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
