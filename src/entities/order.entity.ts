import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Offer } from './offer.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;
  
  @OneToOne(() => Offer, (offer) => offer.order, { onDelete: 'CASCADE' })
  @JoinColumn()
  offer: Offer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
