import { Inject, Injectable } from '@nestjs/common';
import {
  AwardDto,
  AwardYearDto,
  ExtraCurricularDto,
} from './dto/extra-curricular.dto';
import ExtraCurricularEntity, {
  ExtraCategory,
} from './entity/extra-curricular.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/s3/s3.service';
import AwardEntity from './entity/awrds.entity';
import AwardYearEntity from './entity/award-year.entity';

@Injectable()
export class ExtraCurricularService {
  constructor(
    @Inject(S3Service)
    private readonly s3Service: S3Service,
    @InjectRepository(ExtraCurricularEntity)
    private readonly extraCurricularRepository: Repository<ExtraCurricularEntity>,
    @InjectRepository(AwardEntity)
    private readonly awardRepository: Repository<AwardEntity>,
    @InjectRepository(AwardYearEntity)
    private readonly awardYearRepository: Repository<AwardYearEntity>,
  ) {}
  async uploadExtra(
    extraCurricularDto: ExtraCurricularDto,
    img: Express.Multer.File,
  ) {
    if (img === undefined) {
      return;
    }
    const imgUrl = await this.s3Service.upload(img);
    const newExtraCurricular = this.extraCurricularRepository.create({
      title: extraCurricularDto.title,
      content: extraCurricularDto.content,
      img: imgUrl,
      category: extraCurricularDto.category,
      date: extraCurricularDto.date,
    });
    await this.extraCurricularRepository.save(newExtraCurricular);
  }
  async updateExtra(
    extraCurricularDto: ExtraCurricularDto,
    img: Express.Multer.File,
    id: number,
  ) {
    const extra = await this.extraCurricularRepository.findOne({
      where: { id: id },
    });
    let imgUrl = extra.img;
    if (img !== undefined || img !== null) {
      await this.s3Service.delete(imgUrl);
      imgUrl = await this.s3Service.upload(img);
    }
    extra.category = extraCurricularDto.category;
    extra.content = extraCurricularDto.content;
    extra.date = extraCurricularDto.date;
    extra.title = extraCurricularDto.title;
    extra.img = imgUrl;
    await this.extraCurricularRepository.save(extra);
  }
  async getCurrListByCategory(category: ExtraCategory, page: number) {
    const PAGE_SIZE = 5;
    const [curricularList, total] =
      await this.extraCurricularRepository.findAndCount({
        where: { category: category },
        order: {
          createdAt: 'DESC',
        },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });
    return {
      curricularList: curricularList,
      total,
      page,
      last_page: Math.ceil(total / PAGE_SIZE),
    };
  }

  async deleteExtra(id: number) {
    const extra = await this.extraCurricularRepository.findOne({
      where: { id: id },
    });
    await this.s3Service.delete(extra.img);
    await this.extraCurricularRepository.delete(id);
  }

  async uploadAward(awardDto: AwardDto, img: Express.Multer.File) {
    let imgUrl = '';
    if (img !== undefined) {
      imgUrl = await this.s3Service.upload(img);
    }
    const newAward = this.awardRepository.create({
      title: awardDto.title,
      content: awardDto.content,
      img: imgUrl,
      date: awardDto.date,
      winners: awardDto.winners,
      year: { id: awardDto.yearId },
    });
    await this.awardRepository.save(newAward);
  }
  async updateAward(awardDto: AwardDto, img: Express.Multer.File, id: number) {
    const award = await this.awardRepository.findOne({
      where: { id: id },
      relations: ['year'],
    });
    let imgUrl = award.img;
    if (img !== undefined) {
      await this.s3Service.delete(award.img);
      imgUrl = await this.s3Service.upload(img);
    }
    award.content = awardDto.content;
    award.date = awardDto.date;
    award.title = awardDto.title;
    award.img = imgUrl;
    award.winners = awardDto.winners;
    const updateYear = await this.awardYearRepository.findOne({
      where: { id: awardDto.yearId },
    });
    award.year = updateYear;
    await this.awardRepository.save(award);
  }
  async getAllAwardByYear(id: number) {
    return await this.awardRepository.find({
      where: { year: { id: id } },
      relations: ['year'],
    });
  }

  async deleteAward(id: number) {
    const award = await this.awardRepository.findOne({ where: { id: id } });
    await this.s3Service.delete(award.img);
    await this.awardRepository.delete(id);
  }

  async addYear(awardYearDto: AwardYearDto) {
    const newYear = this.awardYearRepository.create({
      year: awardYearDto.year,
      semester: awardYearDto.semester,
    });
    await this.awardYearRepository.save(newYear);
  }
  async getYear() {
    return this.awardYearRepository.find({
      order: {
        year: 'DESC',
        semester: 'DESC',
      },
    });
  }
}
