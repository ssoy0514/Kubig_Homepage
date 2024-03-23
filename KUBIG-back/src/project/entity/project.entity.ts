import UserEntity from 'src/auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProjectCategoryEntity } from './projectCategory';

@Entity()
export default class ProjectEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;

  @Column()
  fileUrl: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @ManyToOne(() => UserEntity, (user) => user.studies) // user
  @JoinColumn({ name: 'user_id' })
  author: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => ProjectCategoryEntity, (category) => category.projects)
  @JoinColumn({ name: 'category_id' })
  category: ProjectCategoryEntity;
}
