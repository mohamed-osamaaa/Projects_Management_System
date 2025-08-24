import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class StaticContent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string; // e.g. "terms", "about", "faq"

  @Column("text")
  content: string;
}
