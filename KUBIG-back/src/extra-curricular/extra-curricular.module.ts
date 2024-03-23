import { Module } from '@nestjs/common';
import { ExtraCurricularController } from './extra-curricular.controller';
import { ExtraCurricularService } from './extra-curricular.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import ExtraCurricularEntity from './entity/extra-curricular.entity';
import { S3Module } from 'src/s3/s3.module';
import AwardYearEntity from './entity/award-year.entity';
import AwardEntity from './entity/awrds.entity';

@Module({
  controllers: [ExtraCurricularController],
  providers: [ExtraCurricularService],
  imports: [
    TypeOrmModule.forFeature([
      ExtraCurricularEntity,
      AwardYearEntity,
      AwardEntity,
    ]),
    S3Module,
  ],
})
export class ExtraCurricularModule {}
