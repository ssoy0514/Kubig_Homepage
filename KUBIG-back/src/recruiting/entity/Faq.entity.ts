import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faq')
export default class FaqEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  question: string;

  @Column()
  answer: string;
}
