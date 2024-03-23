import UserEntity from 'src/auth/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('token')
export default class TokenEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @ManyToOne((type) => UserEntity, (user) => undefined)
  user: UserEntity;
}
