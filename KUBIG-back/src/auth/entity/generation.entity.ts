import UserEntity from 'src/auth/entity/user.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('generation')
export default class GenerationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maxGen: number;
}
