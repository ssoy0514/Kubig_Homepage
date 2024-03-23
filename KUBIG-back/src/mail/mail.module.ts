import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import FindIdEntity from 'src/auth/entity/findId.entity';
import UserEntity from 'src/auth/entity/user.entity';

@Module({
  controllers: [MailController],
  providers: [MailService],
  imports: [MailerModule, TypeOrmModule.forFeature([FindIdEntity, UserEntity])],
})
export class MailModule {}
