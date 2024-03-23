import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudyPostDto } from './dto/create-studyPost.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StudyEntity } from './entity/studies.entity';
import { Repository } from 'typeorm';
import { StudyCategoryEntity } from './entity/studyCategory';
import { SemesterEntity } from './entity/semester';

@Injectable()
export class StudiesService {
  constructor(
    @InjectRepository(StudyEntity)
    private readonly studyRepository: Repository<StudyEntity>,
    @InjectRepository(StudyCategoryEntity)
    private readonly categoryRepository: Repository<StudyCategoryEntity>,
    @InjectRepository(SemesterEntity)
    private readonly semesterRepository: Repository<SemesterEntity>,
  ) {}

  async getCategoryListBySemesterID(
    id: number,
    session: 'basic' | 'advance' | 'magazine',
  ) {
    const categories = await this.categoryRepository.find({
      where: { semester: { id }, sessionType: session },
      order: { name: 'DESC' },
    });
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await this.studyRepository.count({
          where: { category: { id: category.id } },
        });
        return { ...category, count };
      }),
    );
    return categoriesWithCount;
  }
  async getSemesterList() {
    return await this.semesterRepository.find({
      order: { name: 'DESC' },
    });
  }

  // add semester
  async addSemester(name: string) {
    const newSemester = this.semesterRepository.create({ name });
    await this.semesterRepository.save(newSemester);
  }

  async uploadStudy(studyDto: CreateStudyPostDto, id: number) {
    const newStudy = this.studyRepository.create({
      title: studyDto.title,
      content: studyDto.content,
      thumbnailUrl: studyDto.thumbnailUrl,
      author: { id: id },
      category: { id: studyDto.categoryId },
    });

    await this.studyRepository.save(newStudy);
  }

  async findStudyById(id: number) {
    const res = await this.studyRepository.findOne({
      where: { id: id },
      relations: ['author', 'category', 'category.semester'],
    });
    return res;
  }

  // 학기별 스터디 리스트 페이징
  async getStudyList(
    category: number | null,
    page = 1,
    session: 'basic' | 'advance' | 'magazine',
  ) {
    if (category) {
      const PAGE_SIZE = 3;
      const [studyList, total] = await this.studyRepository.findAndCount({
        where: { category: { id: category } },
        relations: ['author', 'category'],
        order: {
          createdAt: 'DESC',
        },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });

      return {
        study: studyList,
        total,
        page,
        last_page: Math.ceil(total / PAGE_SIZE),
      };
    } else {
      const PAGE_SIZE = 3;
      const [studyList, total] = await this.studyRepository.findAndCount({
        where: { category: { sessionType: session } },
        relations: ['author', 'category'],
        order: {
          createdAt: 'DESC',
        },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });

      return {
        study: studyList,
        total,
        page,
        last_page: Math.ceil(total / PAGE_SIZE),
      };
    }
  }

  async getFixedStudies(
    category: number | null,
    session: 'basic' | 'advance' | 'magazine',
  ) {
    const PAGE_SIZE = 3;

    if (category) {
      const [studyList, total] = await this.studyRepository.findAndCount({
        where: {
          category: { id: category },
        },
        relations: ['author', 'category'],
        order: {
          createdAt: 'DESC',
        },
        take: 4,
      });

      return {
        study: studyList,
        total,
        last_page: Math.ceil(total / PAGE_SIZE),
      };
    } else {
      const [studyList, total] = await this.studyRepository.findAndCount({
        where: { category: { sessionType: session } },
        relations: ['author', 'category'],
        order: {
          createdAt: 'DESC',
        },
        take: 4,
      });

      return {
        study: studyList,
        total,
        last_page: Math.ceil(total / PAGE_SIZE),
      };
    }
  }

  async deleteStudy(id: number, userid: number) {
    const study = await this.studyRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!study) {
      throw new NotFoundException('해당 스터디가 존재하지 않습니다.');
    }

    await this.studyRepository.remove(study);
  }

  async updateStudy(id: number, studyDto: CreateStudyPostDto, userid: number) {
    const study = await this.studyRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!study) {
      throw new NotFoundException('해당 스터디가 존재하지 않습니다.');
    }
    if (study.author.id !== userid) {
      throw new NotFoundException('해당 스터디를 수정할 권한이 없습니다.');
    }
    await this.studyRepository.update(
      { id },
      {
        title: studyDto.title,
        content: studyDto.content,
        thumbnailUrl: studyDto.thumbnailUrl,
        category: { id: studyDto.categoryId },
      },
    );
  }

  //add category
  async addCategory({
    name,
    semesterName,
    sessionType,
  }: {
    name: string;
    semesterName: string;
    sessionType: 'basic' | 'advance' | 'magazine';
  }) {
    const semester = await this.semesterRepository.findOne({
      where: { name: semesterName },
    });

    if (!semester) throw Error();
    const newCategory = this.categoryRepository.create({
      name,
      semester: semester,
      sessionType: sessionType,
    });
    await this.categoryRepository.save(newCategory);
  }

  async removeCategory({
    name,
    semesterName,
    sessionType,
  }: {
    name: string;
    semesterName: string;
    sessionType: 'basic' | 'advance' | 'magazine';
  }) {
    const semester = await this.semesterRepository.findOne({
      where: { name: semesterName },
    });

    if (!semester) throw Error();
    await this.categoryRepository.delete({
      name,
      semester: semester,
      sessionType: sessionType,
    });
  }
}
