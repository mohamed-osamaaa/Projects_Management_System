import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Offer } from './offer.entity';
import { User } from './user.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  paymentAccountId: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Offer, (offer) => offer.company)
  offers: Offer[];
}
