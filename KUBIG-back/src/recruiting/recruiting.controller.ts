import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RecruitingService } from './recruiting.service';
import { AuthGuard } from '@nestjs/passport';
import { FaqDto } from './dto/faq.dto';
import { NoticeReqDto } from './dto/RecruitingNotice.dto';

@Controller('recruiting')
export class RecruitingController {
  constructor(private readonly recruitingService: RecruitingService) {}

  @Post('/faq')
  @UseGuards(AuthGuard('jwt'))
  async uploadFaq(@Body() faqDto: FaqDto) {
    return await this.recruitingService.uploadFaq(faqDto);
  }
  @Get('/faq')
  async getFaq() {
    return await this.recruitingService.getFaq();
  }
  @Delete('/faq/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteFaq(@Param('id') id: number) {
    return await this.recruitingService.deleteFaq(id);
  }

  @Put('/notice/fix/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateNoticeFixById(@Param('id') id: number) {
    return await this.recruitingService.updateNoticeFixById(id);
  }
  @Delete('/notice/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteNoticeById(@Param('id') id: number) {
    return await this.recruitingService.deleteNoticeById(id);
  }
  @Post('/notice')
  @UseGuards(AuthGuard('jwt'))
  async uploadNotice(@Req() req, @Body() recruitingNoticeDto: NoticeReqDto) {
    return await this.recruitingService.uploadNotice(
      recruitingNoticeDto,
      req.user.id,
    );
  }

  @Get('/notice')
  async getNoticeList(@Query('page') page: number) {
    return await this.recruitingService.getNoticePage(page);
  }

  @Get('/notice/fix')
  async getFixNoticeList() {
    return await this.recruitingService.getFixNoticeList();
  }

  @Get('/notice/:id')
  async getNoticeById(@Param('id') id: number) {
    return await this.recruitingService.findNoticeById(id);
  }

  @Put('/notice/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateNoticeById(
    @Param('id') id: number,
    @Body() recruitingNoticeDto: NoticeReqDto,
  ) {
    return await this.recruitingService.updateNotcieById(
      id,
      recruitingNoticeDto,
    );
  }
}
