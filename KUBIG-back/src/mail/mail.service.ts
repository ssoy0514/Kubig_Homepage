import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository } from '@nestjs/typeorm';
import FindIdEntity from 'src/auth/entity/findId.entity';
import { Repository } from 'typeorm';
import UserEntity from 'src/auth/entity/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(FindIdEntity)
    private readonly findIdRepository: Repository<FindIdEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async sendVerificationCode(to: string) {
    try {
      const existingCode = await this.findIdRepository.findOne({
        where: { email: to },
      });
      if (existingCode) {
        await this.findIdRepository.remove(existingCode);
      }
      const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');

      await this.mailerService.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject: '[KUBIG] 아이디 찾기 인증 코드입니다.',
        html: `${code}를 인증 코드란에 입력해주세요.`,
      });
      const newCode = this.findIdRepository.create({
        code,
        email: to,
      });
      await this.findIdRepository.save(newCode);
    } catch (err) {
      console.error(err);
    }
  }
  async verifyCode(code: string, email: string) {
    try {
      const existingCode = await this.findIdRepository.findOne({
        where: { email, code },
      });

      if (existingCode) {
        if (existingCode.code === code) {
          await this.findIdRepository.remove(existingCode);
          const result = await this.userRepository.find({
            where: { email },
          });
          if (result.length === 0) return { result: false };
          const data = result.map(
            (user) => user.username.substring(0, 3) + '***',
          );
          return { result: true, data };
        } else {
          return { result: false };
        }
      } else {
        return { result: false };
      }
    } catch (err) {
      console.error(err);
    }
  }

  async sendPwd(to: string, username: string) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username },
      });

      if (!existingUser || existingUser.email !== to) {
        return { result: false };
      }
      const code = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0');
      await this.mailerService.sendMail({
        from: process.env.MAIL_USER,
        to: to,
        subject: '[KUBIG] 비밀번호 찾기 인증 코드입니다.',
        html: `${code}를 인증 코드란에 입력해주세요.`,
      });

      const newCode = this.findIdRepository.create({
        code,
        email: to,
      });
      await this.findIdRepository.save(newCode);
      return { result: true };
    } catch (err) {
      console.error(err);
    }
  }

  async verifyCodePwd(
    code: string,
    email: string,
    username: string,
    password: string,
  ) {
    try {
      const existingCode = await this.findIdRepository.findOne({
        where: { email, code },
      });

      if (existingCode.code !== code) return { result: false };

      const existingUser = await this.userRepository.findOne({
        where: { username },
      });
      if (!existingUser || existingUser.email !== email) {
        return { result: false };
      }

      existingUser.password = password;
      await this.userRepository.save(existingUser);
      await this.findIdRepository.remove(existingCode);
      return { result: true };
    } catch (err) {
      console.error(err);
    }
  }
}
