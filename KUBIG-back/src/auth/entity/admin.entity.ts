import UserEntity from 'src/auth/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('admin')
export default class AdminEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  adminRole: string;

  @ManyToOne((type) => UserEntity, (user) => undefined)
  user: UserEntity;
}
