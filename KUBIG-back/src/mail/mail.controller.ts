import { Body, Controller, Get, HttpStatus, Post, Query } from '@nestjs/common';
import { MailService } from './mail.service';
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/send')
  async sendCode(@Query('to') to: string) {
    try {
      await this.mailService.sendVerificationCode(to);
      return HttpStatus.OK;
    } catch (err) {
      console.error(err);
    }
  }

  @Get('/verify')
  async verifyCode(@Query('code') code: string, @Query('email') email: string) {
    try {
      const result = await this.mailService.verifyCode(code, email);
      return result;
    } catch (err) {
      console.error(err);
    }
  }

  @Post('/send/pwd')
  async sendPwd(@Query('to') to: string, @Query('username') username: string) {
    try {
      return await this.mailService.sendPwd(to, username);
    } catch (err) {
      console.error(err);
    }
  }

  @Post('/reset/pwd')
  async resetPwd(
    @Query('code') code: string,
    @Query('email') email: string,
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    try {
      const result = await this.mailService.verifyCodePwd(
        code,
        email,
        username,
        password,
      );
      return result;
    } catch (err) {
      console.error(err);
    }
  }
}
