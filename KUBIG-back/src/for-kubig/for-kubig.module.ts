import { Module } from '@nestjs/common';
import { ForKubigController } from './for-kubig.controller';
import { ForKubigService } from './for-kubig.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternNoticeEntity } from './entity/InternNotice.entity';
import { KubigNoticeEntity } from './entity/KubigNotice.entity';

@Module({
  controllers: [ForKubigController],
  providers: [ForKubigService],
  imports: [TypeOrmModule.forFeature([InternNoticeEntity, KubigNoticeEntity])],
})
export class ForKubigModule {}
