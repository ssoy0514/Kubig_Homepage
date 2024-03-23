import { Module } from '@nestjs/common';
import { RecruitingController } from './recruiting.controller';
import { RecruitingService } from './recruiting.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import FaqEntity from './entity/Faq.entity';
import { RecruitingNoticeEntity } from './entity/RecruitingNotice.entity';

@Module({
  controllers: [RecruitingController],
  providers: [RecruitingService],
  imports: [TypeOrmModule.forFeature([FaqEntity, RecruitingNoticeEntity])],
})
export class RecruitingModule {}
