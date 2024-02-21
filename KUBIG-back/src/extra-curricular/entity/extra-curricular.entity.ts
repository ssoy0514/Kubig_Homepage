import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
export type ExtraCategory =
  | 'partnership'
  | 'session'
  | 'collaboration'
  | 'awards';
@Entity('extra_curricular')
export default class ExtraCurricularEntity {
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

  @Column()
  category: ExtraCategory;
}
