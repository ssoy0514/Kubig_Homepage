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
import { ProjectService } from './project.service';
import { UploadProjectDto } from './dto/uploadProject.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/category/:id')
  async getCategoryListBySemesterId(
    @Param('id') id: number,
    @Query('session') session: 'contest' | 'conference',
  ) {
    return await this.projectService.getCategoryListBySemesterID(id, session);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async uploadProject(@Body() body: UploadProjectDto, @Req() req) {
    await this.projectService.uploadProject(body, req.user.id);
  }

  @Get('/list')
  async getProjectListByCategoryWithPage(
    @Query('category') category: number | null,
    @Query('session') session: 'contest' | 'conference',
    @Query('page') page: number,
  ) {
    return await this.projectService.getProjectListByCategoryWithPage(
      category,
      page,
      session,
    );
  }

  @Get('/info/:id')
  async getProjectInfoById(@Param('id') id: number) {
    return await this.projectService.getProjectInfoById(id);
  }

  @Get('/delete/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteProjectById(@Param('id') id: number, @Req() req) {
    await this.projectService.deleteProject(id, req.user.id);
  }

  @Post('/update/:id')
  @UseGuards(AuthGuard('jwt'))
  async updateProject(
    @Param('id') id: number,
    @Body() body: UploadProjectDto,
    @Req() req,
  ) {
    await this.projectService.updateProject(id, body, req.user.id);
  }

  @Post('/add/category')
  async addCategory(
    @Body('name') name: string,
    @Body('sessionType') session: 'contest' | 'conference',
    @Body('semester') semester: string,
  ) {
    await this.projectService.addCategory({
      name,
      sessionType: session,
      semesterName: semester,
    });
  }

  @Post('/remove/category')
  async removeCategory(
    @Body('name') name: string,
    @Body('sessionType') session: 'contest' | 'conference',
    @Body('semester') semester: string,
  ) {
    await this.projectService.removeCategory({
      name,
      sessionType: session,
      semesterName: semester,
    });
  }
}
