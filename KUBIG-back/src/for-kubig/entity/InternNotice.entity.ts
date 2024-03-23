import { Notice } from 'src/recruiting/entity/RecruitingNotice.entity';
import { Column, Entity } from 'typeorm';

@Entity('intern_notice')
export class InternNoticeEntity extends Notice {
  @Column('text', { array: true, default: {} })
  tags: string[];

  @Column()
  deadline: 'over' | 'regular' | 'announcement';
}
