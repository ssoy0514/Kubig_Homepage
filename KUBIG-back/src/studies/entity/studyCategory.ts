import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StudyEntity } from './studies.entity';
import { SemesterEntity } from './semester';

@Entity()
export class StudyCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sessionType: 'basic' | 'advance' | 'magazine';

  @ManyToOne(() => SemesterEntity, (semester) => semester.studyCategories)
  semester: SemesterEntity;

  @OneToMany(() => StudyEntity, (study) => study.category)
  studies: StudyEntity[];
}
