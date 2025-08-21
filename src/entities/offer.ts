import { OfferStatus } from 'src/utils/enums/offerStatus.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Company } from './company';
import { Order } from './order';
import { Project } from './project';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column("text")
  description: string;

  @Column({
    type: "enum",
    enum: OfferStatus,
    default: OfferStatus.PENDING
  })
  status: OfferStatus;

  @ManyToOne(() => Project, (project) => project.offers)
  project: Project;

  @ManyToOne(() => Company, (company) => company.offers)
  company: Company;

  @OneToOne(() => Order, (order) => order.offer)
  order: Order;
}
