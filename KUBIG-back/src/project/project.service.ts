import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProjectCategoryEntity } from './entity/projectCategory';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadProjectDto } from './dto/uploadProject.dto';
import ProjectEntity from './entity/project.entity';
import { SemesterEntity } from 'src/studies/entity/semester';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectCategoryEntity)
    private readonly categoryRepository: Repository<ProjectCategoryEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(SemesterEntity)
    private readonly semesterRepository: Repository<SemesterEntity>,
  ) {}
  async getCategoryListBySemesterID(
    id: number,
    session: 'contest' | 'conference',
  ) {
    const categories = await this.categoryRepository.find({
      where: { semester: { id }, sessionType: session },
      order: { name: 'DESC' },
    });
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await this.projectRepository.count({
          where: { category: { id: category.id } },
        });
        return { ...category, count };
      }),
    );
    return categoriesWithCount;
  }

  async uploadProject(dto: UploadProjectDto, userid: number) {
    const newPorject = this.projectRepository.create({
      title: dto.title,
      fileUrl: dto.file,
      category: { id: dto.category },
      thumbnailUrl: dto.thumbnail,
      author: { id: userid },
    });
    await this.projectRepository.save(newPorject);
  }

  async getProjectListByCategoryWithPage(
    category: number | null,
    page: number,
    session: 'contest' | 'conference',
  ) {
    const PAGE_SIZE = 8;
    if (category) {
      const [projectList, total] = await this.projectRepository.findAndCount({
        where: {
          category: { id: category },
        },
        relations: ['author', 'category'],
        order: {
          createdAt: 'DESC',
        },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });

      return {
        projectList,
        total,
        page,
        last_page: Math.ceil(total / PAGE_SIZE),
      };
    } else {
      const [projectList, total] = await this.projectRepository.findAndCount({
        where: {
          category: { sessionType: session },
        },
        relations: ['author', 'category'],
        order: {
          createdAt: 'DESC',
        },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });

      return {
        projectList,
        total,
        page,
        last_page: Math.ceil(total / PAGE_SIZE),
      };
    }
  }
  async getProjectInfoById(id: number) {
    return await this.projectRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'category.semester'],
    });
  }

  async deleteProject(id: number, userid: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!project) {
      throw new NotFoundException('해당 스터디가 존재하지 않습니다.');
    }

    await this.projectRepository.remove(project);
  }

  async updateProject(id: number, dto: UploadProjectDto, userid: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!project) {
      throw new NotFoundException('해당 스터디가 존재하지 않습니다.');
    }
    if (project.author.id !== userid) {
      throw new NotFoundException('해당 스터디를 수정할 권한이 없습니다.');
    }
    await this.projectRepository.update(
      { id },
      {
        title: dto.title,
        fileUrl: dto.file,
        category: { id: dto.category },
        thumbnailUrl: dto.thumbnail,
      },
    );
  }

  async addCategory({
    name,
    semesterName,
    sessionType,
  }: {
    name: string;
    semesterName: string;
    sessionType: 'contest' | 'conference';
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
    sessionType: 'contest' | 'conference';
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
