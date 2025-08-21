import { TicketPriority } from 'src/utils/enums/ticketPriority.enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user';

@Entity()
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

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
  assignedTo: User; // admin handling the ticket
}
