import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import FaqEntity from './entity/Faq.entity';
import { Repository } from 'typeorm';
import { FaqDto } from './dto/faq.dto';
import { RecruitingNoticeEntity } from './entity/RecruitingNotice.entity';
import { NoticeReqDto, NoticeResDto } from './dto/RecruitingNotice.dto';

@Injectable()
export class RecruitingService {
  constructor(
    @InjectRepository(FaqEntity)
    private readonly faqRepository: Repository<FaqEntity>,
    @InjectRepository(RecruitingNoticeEntity)
    private readonly recruitingNoticeRepository: Repository<RecruitingNoticeEntity>,
  ) {}

  async uploadFaq(faqDto: FaqDto) {
    const faq = this.faqRepository.create({
      question: faqDto.question,
      answer: faqDto.answer,
    });
    await this.faqRepository.save(faq);
  }
  async deleteFaq(id: number) {
    await this.faqRepository.delete(id);
  }
  async getFaq() {
    return await this.faqRepository.find();
  }
  async uploadNotice(recruitingNoticeDto: NoticeReqDto, id: number) {
    const newNotice = this.recruitingNoticeRepository.create({
      title: recruitingNoticeDto.title,
      content: recruitingNoticeDto.content,
      author: { id: id },
    });
    await this.recruitingNoticeRepository.save(newNotice);
  }
  async getFixNoticeList() {
    const noticeEntityList = await this.recruitingNoticeRepository.find({
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
      await this.recruitingNoticeRepository.findAndCount({
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
    const notice = await this.recruitingNoticeRepository.findOne({
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
  async updateNotcieById(id: number, recruitingNoticeDto: NoticeReqDto) {
    const notice = await this.recruitingNoticeRepository.findOne({
      where: { id: id },
    });
    notice.content = recruitingNoticeDto.content;
    notice.title = recruitingNoticeDto.title;

    await this.recruitingNoticeRepository.save(notice);
  }
  async deleteNoticeById(id: number) {
    await this.recruitingNoticeRepository.delete(id);
  }
  async updateNoticeFixById(id: number) {
    const notice = await this.recruitingNoticeRepository.findOne({
      where: { id: id },
    });
    notice.fixed = !notice.fixed;
    await this.recruitingNoticeRepository.save(notice);
  }
}
