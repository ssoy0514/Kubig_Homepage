import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectCategoryEntity } from './entity/projectCategory';
import ProjectEntity from './entity/project.entity';
import { SemesterEntity } from 'src/studies/entity/semester';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [
    TypeOrmModule.forFeature([
      ProjectCategoryEntity,
      ProjectEntity,
      SemesterEntity,
    ]),
  ],
})
export class ProjectModule {}
