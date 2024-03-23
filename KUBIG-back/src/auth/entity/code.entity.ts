import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class CodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;
}
