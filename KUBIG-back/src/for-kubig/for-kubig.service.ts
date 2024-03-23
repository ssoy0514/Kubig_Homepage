import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KubigNoticeEntity } from './entity/KubigNotice.entity';
import { InternNoticeEntity } from './entity/InternNotice.entity';
import {
  NoticeReqDto,
  NoticeResDto,
} from 'src/recruiting/dto/RecruitingNotice.dto';

@Injectable()
export class ForKubigService {
  constructor(
    @InjectRepository(KubigNoticeEntity)
    private readonly kubigNoticeRepository: Repository<KubigNoticeEntity>,
    @InjectRepository(InternNoticeEntity)
    private readonly internNoticeRepository: Repository<InternNoticeEntity>,
  ) {}

  async uploadNotice(noticeDto: NoticeReqDto, id: number) {
    const newNotice = this.kubigNoticeRepository.create({
      title: noticeDto.title,
      content: noticeDto.content,
      author: { id: id },
    });
    await this.kubigNoticeRepository.save(newNotice);
  }
  async getFixNoticeList() {
    const noticeEntityList = await this.kubigNoticeRepository.find({
      where: { fixed: true },
      relations: ['author'],
    });
    const noticeDtoList: NoticeResDto[] = noticeEntityList.map((n) => {
      return {
        id: n.id,
        title: n.title,
        content: n.content,
        author: {
          name: n.author.name,
          generation: n.author.generation,
        },
        fixed: n.fixed,
        createdAt: n.createdAt,
      } as NoticeResDto;
    });

    return {
      noticeList: noticeDtoList,
    };
  }
  async getNoticePage(page: number) {
    const PAGE_SIZE = 4;
    const [noticeEntityList, total] =
      await this.kubigNoticeRepository.findAndCount({
        relations: ['author'],
        order: {
          createdAt: 'DESC',
        },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });
    const noticeDtoList: NoticeResDto[] = noticeEntityList.map((n) => {
      return {
        id: n.id,
        title: n.title,
        content: n.content,

        author: {
          name: n.author.name,
          generation: n.author.generation,
        },
        fixed: n.fixed,
        createdAt: n.createdAt,
      } as NoticeResDto;
    });
    return {
      noticeList: noticeDtoList,
      total,
      page,
      last_page: Math.ceil(total / PAGE_SIZE),
    };
  }
  async findNoticeById(id: number) {
    const notice = await this.kubigNoticeRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });
    const res = {
      id: notice.id,
      title: notice.title,
      content: notice.content,

      author: {
        name: notice.author.name,
        generation: notice.author.generation,
      },
      fixed: notice.fixed,
      createdAt: notice.createdAt,
    } as NoticeResDto;

    return res;
  }
  async updateNotcieById(id: number, noticeDto: NoticeReqDto) {
    const notice = await this.kubigNoticeRepository.findOne({
      where: { id: id },
    });
    notice.content = noticeDto.content;
    notice.title = noticeDto.title;

    await this.kubigNoticeRepository.save(notice);
  }
  async deleteNoticeById(id: number) {
    await this.kubigNoticeRepository.delete(id);
  }
  async updateNoticeFixById(id: number) {
    const notice = await this.kubigNoticeRepository.findOne({
      where: { id: id },
    });
    notice.fixed = !notice.fixed;
    await this.kubigNoticeRepository.save(notice);
  }

  // intern
  async uploadInternNotice(noticeDto: NoticeReqDto, id: number) {
    const newNotice = this.internNoticeRepository.create({
      title: noticeDto.title,
      content: noticeDto.content,
      author: { id: id },
      tags: noticeDto.tags,
      deadline: noticeDto.deadline,
    });
    await this.internNoticeRepository.save(newNotice);
  }
  async getFixInternNoticeList() {
    const noticeEntityList = await this.internNoticeRepository.find({
      where: { fixed: true },
      relations: ['author'],
    });
    const noticeDtoList: NoticeResDto[] = noticeEntityList.map((n) => {
      return {
        id: n.id,
        title: n.title,
        content: n.content,
        author: {
          name: n.author.name,
          generation: n.author.generation,
        },
        tags: n.tags,
        deadline: n.deadline,
        fixed: n.fixed,
        createdAt: n.createdAt,
      } as NoticeResDto;
    });

    return {
      noticeList: noticeDtoList,
    };
  }
  async getInternNoticePage(page: number) {
    const PAGE_SIZE = 4;
    const [noticeEntityList, total] =
      await this.internNoticeRepository.findAndCount({
        relations: ['author'],
        order: {
          createdAt: 'DESC',
        },
        take: PAGE_SIZE,
        skip: (page - 1) * PAGE_SIZE,
      });
    const noticeDtoList: NoticeResDto[] = noticeEntityList.map((n) => {
      return {
        id: n.id,
        title: n.title,
        content: n.content,
        author: {
          name: n.author.name,
          generation: n.author.generation,
        },
        tags: n.tags,
        deadline: n.deadline,
        fixed: n.fixed,
        createdAt: n.createdAt,
      } as NoticeResDto;
    });
    return {
      noticeList: noticeDtoList,
      total,
      page,
      last_page: Math.ceil(total / PAGE_SIZE),
    };
  }
  async findInternNoticeById(id: number) {
    const notice = await this.internNoticeRepository.findOne({
      where: { id: id },
      relations: ['author'],
    });
    const res = {
      id: notice.id,
      title: notice.title,
      content: notice.content,
      author: {
        name: notice.author.name,
        generation: notice.author.generation,
      },
      tags: notice.tags,
      deadline: notice.deadline,
      fixed: notice.fixed,
      createdAt: notice.createdAt,
    } as NoticeResDto;

    return res;
  }
  async updateInternNotcieById(id: number, noticeDto: NoticeReqDto) {
    const notice = await this.internNoticeRepository.findOne({
      where: { id: id },
    });
    notice.content = noticeDto.content;
    notice.title = noticeDto.title;
    notice.tags = noticeDto.tags;
    notice.deadline = noticeDto.deadline;

    await this.internNoticeRepository.save(notice);
  }
  async deleteInternNoticeById(id: number) {
    await this.internNoticeRepository.delete(id);
  }
  async updateInternNoticeFixById(id: number) {
    const notice = await this.internNoticeRepository.findOne({
      where: { id: id },
    });
    notice.fixed = !notice.fixed;
    await this.internNoticeRepository.save(notice);
  }
}
