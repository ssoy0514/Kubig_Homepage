import { Notice } from 'src/recruiting/entity/RecruitingNotice.entity';
import { Column, Entity } from 'typeorm';

@Entity('kubig_notice')
export class KubigNoticeEntity extends Notice {}
