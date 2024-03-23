import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExtraCurricularService } from './extra-curricular.service';
import {
  AwardDto,
  AwardYearDto,
  ExtraCurricularDto,
} from './dto/extra-curricular.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ExtraCategory } from './entity/extra-curricular.entity';

@Controller('extra-curricular')
export class ExtraCurricularController {
  constructor(
    private readonly extraCurricularService: ExtraCurricularService,
  ) {}

  @Get('/list')
  async getExtraList(
    @Query('category')
    category: ExtraCategory,
    @Query('page') page: number,
  ) {
    return await this.extraCurricularService.getCurrListByCategory(
      category,
      page,
    );
  }
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('img'))
  async uploadExtra(
    @Body() extraCurricularDto: ExtraCurricularDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return await this.extraCurricularService.uploadExtra(
      extraCurricularDto,
      img,
    );
  }
  @Put('/:id')
  @UseInterceptors(FileInterceptor('img'))
  async updateExtra(
    @Body() extraCurricularDto: ExtraCurricularDto,
    @UploadedFile() img: Express.Multer.File,
    @Param('id') id: number,
  ) {
    return await this.extraCurricularService.updateExtra(
      extraCurricularDto,
      img,
      id,
    );
  }
  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteExtraById(@Param('id') id: number) {
    return await this.extraCurricularService.deleteExtra(id);
  }

  @Get('/awards/list')
  async getAwardList(@Query('year') yearId: number) {
    return await this.extraCurricularService.getAllAwardByYear(yearId);
  }
  @Post('/awards')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('img'))
  async uploadAward(
    @Body() awardDto: AwardDto,
    @UploadedFile() img: Express.Multer.File,
  ) {
    return await this.extraCurricularService.uploadAward(awardDto, img);
  }

  @Put('/awards/:id')
  @UseInterceptors(FileInterceptor('img'))
  async updateAwards(
    @Body() awardDto: AwardDto,
    @UploadedFile() img: Express.Multer.File,
    @Param('id') id: number,
  ) {
    return await this.extraCurricularService.updateAward(awardDto, img, id);
  }
  @Delete('/awards/:id')
  @UseGuards(AuthGuard('jwt'))
  async deleteAwardsById(@Param('id') id: number) {
    return await this.extraCurricularService.deleteAward(id);
  }

  @Post('/awards/year')
  @UseGuards(AuthGuard('jwt'))
  async addYear(@Body() awardYearDto: AwardYearDto) {
    return await this.extraCurricularService.addYear(awardYearDto);
  }

  @Get('/awards/year')
  async getYear() {
    return await this.extraCurricularService.getYear();
  }
}
