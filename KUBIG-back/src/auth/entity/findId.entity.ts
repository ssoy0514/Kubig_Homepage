import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export default class FindIdEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  email: string;
}
