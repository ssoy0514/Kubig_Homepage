import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StudyCategoryEntity } from './studyCategory';
import { ProjectCategoryEntity } from 'src/project/entity/projectCategory';

@Entity()
export class SemesterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => StudyCategoryEntity, (category) => category.semester)
  studyCategories: StudyCategoryEntity[];

  @OneToMany(() => ProjectCategoryEntity, (category) => category.semester)
  projectCategories: ProjectCategoryEntity[];
}
