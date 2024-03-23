import UserEntity from 'src/auth/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
export abstract class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @ManyToOne(() => UserEntity) // user
  @JoinColumn({ name: 'user_id' })
  author: UserEntity;

  @Column({ default: false })
  fixed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
@Entity('recruiting_notice')
export class RecruitingNoticeEntity extends Notice {}
