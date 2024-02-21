import UserEntity from 'src/auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudyCategoryEntity } from './studyCategory';

@Entity('studies')
export class StudyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @ManyToOne(() => UserEntity, (user) => user.studies) // user
  @JoinColumn({ name: 'user_id' })
  author: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => StudyCategoryEntity, (category) => category.studies)
  @JoinColumn({ name: 'category_id' })
  category: StudyCategoryEntity;
}
