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
import { ForKubigService } from './for-kubig.service';
import { AuthGuard } from '@nestjs/passport';
import { NoticeReqDto } from 'src/recruiting/dto/RecruitingNotice.dto';

@Controller('for-kubig')
export class ForKubigController {
  constructor(private readonly forKubigService: ForKubigService) {}

  @Put('/notice/fix/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateNoticeFixById(@Param('id') id: number) {
    return await this.forKubigService.updateNoticeFixById(id);
  }
  @Delete('/notice/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteNoticeById(@Param('id') id: number) {
    return await this.forKubigService.deleteNoticeById(id);
  }
  @Post('/notice')
  @UseGuards(AuthGuard('jwt'))
  async uploadNotice(@Req() req, @Body() noticeDto: NoticeReqDto) {
    return await this.forKubigService.uploadNotice(noticeDto, req.user.id);
  }

  @Get('/notice')
  async getNoticeList(@Query('page') page: number) {
    return await this.forKubigService.getNoticePage(page);
  }

  @Get('/notice/fix')
  async getFixNoticeList() {
    return await this.forKubigService.getFixNoticeList();
  }

  @Get('/notice/:id')
  async getNoticeById(@Param('id') id: number) {
    return await this.forKubigService.findNoticeById(id);
  }

  @Put('/notice/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateNoticeById(
    @Param('id') id: number,
    @Body() noticeDto: NoticeReqDto,
  ) {
    return await this.forKubigService.updateNotcieById(id, noticeDto);
  }

  @Put('/intern-notice/fix/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateInternNoticeFixById(@Param('id') id: number) {
    return await this.forKubigService.updateInternNoticeFixById(id);
  }
  @Delete('/intern-notice/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteInternNoticeById(@Param('id') id: number) {
    return await this.forKubigService.deleteInternNoticeById(id);
  }
  @Post('/intern-notice')
  @UseGuards(AuthGuard('jwt'))
  async uploadInternNotice(@Req() req, @Body() internNoticeDto: NoticeReqDto) {
    return await this.forKubigService.uploadInternNotice(
      internNoticeDto,
      req.user.id,
    );
  }

  @Get('/intern-notice')
  async getInternNoticeList(@Query('page') page: number) {
    return await this.forKubigService.getInternNoticePage(page);
  }

  @Get('/intern-notice/fix')
  async getFixInternNoticeList() {
    return await this.forKubigService.getFixInternNoticeList();
  }

  @Get('/intern-notice/:id')
  async getInternNoticeById(@Param('id') id: number) {
    return await this.forKubigService.findInternNoticeById(id);
  }

  @Put('/intern-notice/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateInternNoticeById(
    @Param('id') id: number,
    @Body() internNoticeDto: NoticeReqDto,
  ) {
    return await this.forKubigService.updateInternNotcieById(
      id,
      internNoticeDto,
    );
  }
}
