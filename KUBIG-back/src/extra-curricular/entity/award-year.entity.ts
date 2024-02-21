import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('awards_year')
export default class AwardYearEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  year: number;

  @Column()
  semester: number;
}
