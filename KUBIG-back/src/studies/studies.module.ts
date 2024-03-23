import { Module } from '@nestjs/common';
import { StudiesController } from './studies.controller';
import { StudiesService } from './studies.service';
import { StudyEntity } from './entity/studies.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudyCategoryEntity } from './entity/studyCategory';
import { SemesterEntity } from './entity/semester';

@Module({
  controllers: [StudiesController],
  providers: [StudiesService],
  imports: [
    TypeOrmModule.forFeature([
      StudyEntity,
      StudyCategoryEntity,
      SemesterEntity,
    ]),
  ],
})
export class StudiesModule {}
