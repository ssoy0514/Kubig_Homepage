import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin_password')
export default class AdminPasswordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  passwd: string;
}
