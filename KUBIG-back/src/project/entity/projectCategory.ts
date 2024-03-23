import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { SemesterEntity } from 'src/studies/entity/semester';
import ProjectEntity from './project.entity';

@Entity()
export class ProjectCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  sessionType: 'conference' | 'contest';

  @ManyToOne(() => SemesterEntity, (semester) => semester.studyCategories)
  semester: SemesterEntity;

  @OneToMany(() => ProjectEntity, (study) => study.category)
  projects: ProjectEntity[];
}
