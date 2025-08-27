import { Exclude } from 'class-transformer';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Milestone } from './milestone.entity';
import { Offer } from './offer.entity';
import { Payment } from './payment.entity';
import { User } from './user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Exclude()
  @Column()
  paymentAccountId: string;

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  owner: User;

  @OneToMany(() => User, (user) => user.company)
  engineers: User[];

  @OneToMany(() => Offer, (offer) => offer.company)
  offers: Offer[];

  @OneToMany(() => Milestone, (milestone) => milestone.company, { nullable: true })
  milestones: Milestone[];

  @OneToMany(() => Payment, (payment) => payment.paymentTo, { nullable: false })
  paymentsReceived: Payment[];
}
