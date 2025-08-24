import { TicketPriority } from 'src/utils/enums/ticketPriority.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  subject: string;

  @Column("text")
  description: string;

  @Column({ default: "open" })
  status: string;

  @Column({
    type: "enum",
    enum: TicketPriority,
    default: TicketPriority.MEDIUM
  })
  priority: TicketPriority;

  @ManyToOne(() => User, (user) => user.tickets)
  user: User;

  @ManyToOne(() => User, { nullable: true })
  assignedTo: User; // customer support handling the ticket
}
