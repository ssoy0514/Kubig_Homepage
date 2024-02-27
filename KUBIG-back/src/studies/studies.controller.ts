import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { StudiesService } from './studies.service';
import { CreateStudyPostDto } from './dto/create-studyPost.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('studies')
export class StudiesController {
  constructor(private readonly studiesService: StudiesService) {}
  @Get('/info/:id')
  async getStudyById(@Param('id') id: number) {
    return await this.studiesService.findStudyById(id);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async uploadStudy(@Req() req, @Body() styudyPostDto: CreateStudyPostDto) {
    return await this.studiesService.uploadStudy(styudyPostDto, req.user.id);
  }

  @Get('/semesters')
  async getSemesterList() {
    return await this.studiesService.getSemesterList();
  }

  @Get('/category/:id')
  async getCategoryListBySemesterId(
    @Param('id') id: number,
    @Query('session') session: 'basic' | 'advance' | 'magazine',
  ) {
    return await this.studiesService.getCategoryListBySemesterID(id, session);
  }

  @Get('/list')
  async getStudyList(
    @Query('category') category: number | null,
    @Query('page') page: number,
    @Query('semester') semester: number,
    @Query('session') session: 'basic' | 'advance' | 'magazine',
  ) {
    return await this.studiesService.getStudyList(category, page, semester, session);
  }

  @Get('/fixed')
  async getFixedStudies(
    @Query('category') category: number | null,
    @Query('session') session: 'basic' | 'advance' | 'magazine',
  ) {
    return await this.studiesService.getFixedStudies(category, session);
  }

  @Get('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteStudyById(@Param('id') id: number, @Req() req) {
    await this.studiesService.deleteStudy(id, req.user.id);
  }

  @Get('/recent_list')
  async getRecentStudyList() {
    return await this.studiesService.getRecentStudyList();
  }

  @Post('/update/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateStudy(
    @Param('id') id: number,
    @Body() body: CreateStudyPostDto,
    @Req() req,
  ) {
    await this.studiesService.updateStudy(id, body, req.user.id);
  }

  // add semester
  @Post('/semester/:name')
  async addSemester(@Param('name') name: string) {
    await this.studiesService.addSemester(name);
  }

  // add category
  @Post('/new/category')
  async addCategory(
    @Body()
    body: {
      name: string;
      semesterName: string;
      sessionType: 'basic' | 'advance' | 'magazine';
    },
  ) {
    await this.studiesService.addCategory(body);
  }

  @Post('/delete/category')
  async removeCategory(
    @Body()
    body: {
      name: string;
      semesterName: string;
      sessionType: 'basic' | 'advance' | 'magazine';
    },
  ) {
    await this.studiesService.removeCategory(body);
  }
}
