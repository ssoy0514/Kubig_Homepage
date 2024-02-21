import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from 'src/interfaces/auth';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileDto } from './dto/profile.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/admins')
  async getAdmins() {
    return await this.authService.getAdmins();
  }

  @Post('/signup')
  async signup(@Res() res: Response, @Body() signupDto: SignupDto) {
    try {
      await this.authService.signup(signupDto);
      res.sendStatus(201);
    } catch (e) {
      console.log(e);
      res.status(e.statusCode || 400).json({ message: e.message });
    }
  }

  @Post('/login')
  @UseGuards(AuthGuard('local'))
  async login(@Req() req, @Res() res: Response) {
    try {
      const jwtPayload: JwtPayload = {
        signedAt: new Date().toISOString(),
        id: req.user.id,
        role: req.user.role,
        name: req.user.name,
      };
      const token = await this.authService.getToken(jwtPayload);
      await this.authService.saveRefreshToken(token.refreshToken, req.user.id);

      res.json({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        roles: req.user.role,
        name: req.user.name,
      });
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: e.message });
    }
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('jwt-refresh'))
  async refresh(@Req() req, @Res() res) {
    try {
      const { refreshToken, id, role, name } = req.user;

      await this.authService.checkRefreshToken(refreshToken, id);
      const payload: JwtPayload = {
        id,
        name: name,
        signedAt: new Date().toISOString(),
        role: role,
      };
      const token = await this.authService.getToken(payload);
      await this.authService.saveRefreshToken(token.refreshToken, id);

      res.json({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });
    } catch (err) {
      res.sendStatus(401);
    }
  }

  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req) {
    const { id } = req.user;
    await this.authService.removeRefreshToken(id);
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req) {
    return {
      role: req.user.role,
      name: req.user.name,
    };
  }

  @Get('/mypage')
  @UseGuards(AuthGuard('jwt'))
  async getInfo(@Req() req, @Res() res) {
    try {
      const user = await this.authService.getInfo(req.user.id);
      res.json({
        user: user,
      });
    } catch (err) {
      res.status(err.status).json({ message: err.message });
    }
  }

  @Get('/code')
  async checkCode(@Req() req, @Res() res: Response) {
    try {
      const { code } = req.query;
      await this.authService.validateAuthCode(code.toString());
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: e.message });
    }
  }

  @Get('/username')
  async checkName(@Req() req, @Res() res: Response) {
    try {
      const { username } = req.query;
      await this.authService.validateUsername(username.toString());
      res.sendStatus(200);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: e.message });
    }
  }

  @Get('/members')
  async getMembersInfo() {
    return this.authService.getMemberList();
  }

  @Put('/profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req, @Body() profileDto: ProfileDto) {
    return await this.authService.updateProfile(req.user.id, profileDto);
  }

  @Put('/profile-img')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('img'))
  async updateProfileImg(@Req() req, @UploadedFile() img: Express.Multer.File) {
    return await this.authService.updateProfileImg(req.user.id, img);
  }

  @Get('/generation')
  async getGeneration() {
    return await this.authService.getGeneration();
  }

  @Get('/admin/:pw')
  async checkAdminPw(@Param('pw') pw: string) {
    const result = await this.authService.checkAdminPw(pw);
    return { result };
  }

  // update admin pw
  @Post('/admin/:pw')
  async updateAdminPw(@Param('pw') pw: string) {
    await this.authService.updateAdminPw(pw);
  }

  // set max gen
  @Post('/generation/:gen')
  async setMaxGen(@Param('gen') gen: number) {
    await this.authService.setMaxGen(gen);
  }

  // remove admin
  @Post('/admin/remove/:email')
  async removeAdmin(@Param('email') email: string) {
    await this.authService.removeAdmin(email);
  }

  @Post('/admin/add/:email')
  async addAdmin(@Param('email') email: string) {
    await this.authService.addAdmin(email);
  }

  @Post('/admin/set/:email')
  async setAdminRole(
    @Param('email') email: string,
    @Body() body: { role: string },
  ) {
    await this.authService.setAdminRole(email, body.role);
  }

  @Post('/badge/:email')
  async setProfileBadge(
    @Param('email') email: string,
    @Body() body: { badge: string },
  ) {
    await this.authService.setProfileBadge(email, body.badge);
  }

  @Post('/user/remove')
  async removeUser(
    @Body() body: { studentId: number; gen: number; name: string },
  ) {
    await this.authService.removeUser(body.studentId, body.gen, body.name);
  }

  @Post('/user/add')
  async addUser(
    @Body()
    body: {
      studentId: number | undefined;
      gen: number;
      name: string;
      email: string | undefined;
      major: string;
      career: string | undefined;
      blog: string | undefined;
      imgUrl: string | undefined;
    },
  ) {
    await this.authService.addUser(body);
  }

  @Post('/user/accept/:id')
  async acceptUser(@Param('id') id: number) {
    await this.authService.acceptUser(id);
  }
  @Post('/user/accept/remove/:id')
  async removeacceptUser(@Param('id') id: number) {
    await this.authService.remove2User(id);
  }

  @Get('/user/accept')
  async getAcceptUser() {
    const data = await this.authService.getAcceptableUsers();
    return data;
  }

  @Post('/change/code/:code')
  async changeCode(@Param('code') code: string) {
    await this.authService.changeCode(code);
  }
}
