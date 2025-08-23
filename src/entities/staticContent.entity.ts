import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StaticContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // e.g. "terms", "about", "faq"

  @Column("text")
  content: string;
}
