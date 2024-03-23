import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import AwardYearEntity from './award-year.entity';

@Entity('awards')
export default class AwardEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  date: string;

  @Column()
  img: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column('text', { array: true, default: {} })
  winners: string[];

  @ManyToOne(() => AwardYearEntity)
  @JoinColumn({ name: 'year' })
  year: AwardYearEntity;
}
