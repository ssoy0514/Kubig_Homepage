import { StudyEntity } from 'src/studies/entity/studies.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  role: string;

  @Column()
  major: string;

  @Column({ nullable: true })
  studentId: number;

  @Column({ nullable: true })
  email: string;

  @Column()
  name: string;

  @Column()
  generation: number;

  @Column({ default: false, nullable: true })
  accepted: boolean;

  @Column({ default: '' })
  img: string;
  @Column({ default: '' })
  career: string;
  @Column({ default: '' })
  blog: string;
  @Column({ default: '' })
  profileBadge: string;

  @OneToMany((type) => StudyEntity, (study) => study.author)
  studies: StudyEntity[];
}
