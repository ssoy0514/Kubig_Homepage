import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('s3')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard('jwt'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    const url = this.s3Service.upload(file);
    return url;
  }

  @Post('/admin')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile2(@UploadedFile() file: Express.Multer.File) {
    const url = this.s3Service.upload(file);
    return url;
  }
}
