import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import UserEntity from './entity/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { JwtPayload, User } from 'src/interfaces/auth';
import CodeEntity from './entity/code.entity';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import TokenEntity from './entity/token.entity';
import { S3Service } from 'src/s3/s3.service';
import { ProfileDto } from './dto/profile.dto';
import GenerationEntity from './entity/generation.entity';
import AdminEntity from './entity/admin.entity';
import AdminPasswordEntity from './entity/adminPw.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(CodeEntity)
    private readonly codeRepository: Repository<CodeEntity>,
    @InjectRepository(TokenEntity)
    private readonly tokenRepository: Repository<TokenEntity>,
    private jwtService: JwtService,
    @Inject(S3Service)
    private readonly s3Service: S3Service,
    @InjectRepository(GenerationEntity)
    private readonly generationRepository: Repository<GenerationEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    @InjectRepository(AdminPasswordEntity)
    private readonly adminPasswordRepository: Repository<AdminPasswordEntity>,
  ) {}

  async changeCode(code) {
    const authCode = await this.codeRepository.findOne({
      where: { id: 1 },
    });
    authCode.code = code;
    await this.codeRepository.save(authCode);
  }
  DEPARTMENT_OPTIONS = [
    '국어국문학과',
    '철학과',
    '한국사학과',
    '사학과',
    '사회학과',
    '한문학과',
    '영어영문학과',
    '독어독문학과',
    '불어불문학과',
    '중어중문학과',
    '노어노문학과',
    '일어일문학과',
    '서어서문학과',
    '언어학과',
    '생명과학부',
    '생명공학부',
    '식품공학과',
    '환경생태공학부',
    '식품자원경제학과',
    '정치외교학과',
    '경영학과',
    '경제학과',
    '통계학과',
    '행정학과',
    '수학과',
    '물리학과',
    '화학과',
    '지구환경과학과',
    '화공생명공학과',
    '신소재공학부',
    '건축사회환경공학부',
    '건축학과',
    '기계공학부',
    '산업경영공학부',
    '전기전자공학부',
    '융합에너지공학과',
    '반도체공학과',
    '차세대통신학과',
    '의(예)학과',
    '교육학과',
    '국어교육과',
    '영어교육과',
    '지리교육과',
    '역사교육과',
    '가정교육과',
    '수학교육과',
    '체육교육과',
    '간호학과',
    '컴퓨터학과',
    '데이터과학과',
    '디자인조형학부',
    '국제학부',
    '글로벌한국융합학부',
    '미디어학부',
    '바이오의공학부',
    '바이오시스템의과학부',
    '보건환경융합과학부',
    '보건정책관리학부',
    '자유전공학부',
    '스마트모빌리티학부',
    '스마트보안학부',
    '사이버국방학과',
    '심리학부',
  ];

  async getAdmins() {
    const admins = await this.adminRepository.find({ relations: ['user'] });
    return admins.map((admin) => {
      return {
        name: admin.user.name,
        gen: admin.user.generation,
        adminRole: admin.adminRole,
      };
    });
  }

  async signup(signupDto: SignupDto) {
    const USER_REGEX = /^[A-z][A-z0-9-_]{3,20}$/; // id 검사
    const PWD_REGEX = /^(?=.*[A-z])(?=.*[0-9])(?=.*[!@#$%]).{8,16}$/;
    const maxGen = await this.getGeneration();
    if (signupDto.generation > maxGen)
      throw new HttpException('올바르지 않은 기수입니다.', 400);
    if (
      !USER_REGEX.test(signupDto.username) ||
      !PWD_REGEX.test(signupDto.password)
    ) {
      throw new HttpException('잘못된 형식의 아이디 또는 비밀번호입니다.', 400);
    }
    if (!this.DEPARTMENT_OPTIONS.includes(signupDto.major))
      throw new HttpException('올바르지 않은 학과입니다.', 400);

    const authCode = await this.codeRepository.findOne({
      where: { code: signupDto.code },
    });
    if (!authCode) throw new HttpException('잘못된 인증 코드입니다.', 404);

    const user = await this.userRepository.findOne({
      where: { username: signupDto.username, accepted: true },
    });
    if (user) throw new HttpException('이미 존재하는 유저입니다.', 409);
    const user2 = await this.userRepository.findOne({
      where: {
        name: signupDto.name,
        generation: signupDto.generation,
        studentId: signupDto.studentId,
        password: IsNull(),
        accepted: true,
      },
    });
    if (user2) throw new HttpException('이미 존재하는 유저입니다.', 409);
    if (
      signupDto.studentId >
      parseInt(new Date().getFullYear().toString().slice(2, 4))
    )
      throw new HttpException('올바르지 않은 학번입니다.', 400);

    const newUser = await this.userRepository.create({
      username: signupDto.username,
      password: signupDto.password,
      role: 'user',
      major: signupDto.major,
      studentId: signupDto.studentId,
      email: signupDto.email,
      name: signupDto.name,
      generation: signupDto.generation,
      accepted: false,
    });
    await this.userRepository.save(newUser);
  }

  async validateUsername(username: string) {
    const user = await this.userRepository.findOne({
      where: { username: username },
    });
    if (user) throw new HttpException('이미 존재하는 아이디입니다.', 409);
  }

  async validateAuthCode(code: string) {
    const authCode = await this.codeRepository.findOne({
      where: { code: code },
    });
    if (!authCode) throw new HttpException('잘못된 인증 코드입니다.', 404);
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username: username, password: password },
    });

    if (!user)
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    if (!user.accepted)
      throw new UnauthorizedException('승인되지 않은 사용자입니다.');
    return {
      id: user.id,
      role: user.role,
      name: user.name,
    };
  }

  async getToken(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET_KEY,
    });

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '30d',
      secret: process.env.JWT_REFRESH_SECRET_KEY,
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(refreshToken: string, id: number) {
    const existingToken = await this.tokenRepository.find({
      where: { user: { id } },
    });
    this.tokenRepository.remove(existingToken);
    const token = await this.tokenRepository.create({
      refreshToken,
      user: { id },
    });
    await this.tokenRepository.save(token);
  }
  async removeRefreshToken(id: number) {
    await this.tokenRepository.delete({ user: { id: id } });
  }
  async checkRefreshToken(refreshToken: string, id: number) {
    const token = await this.tokenRepository.findOne({
      where: { user: { id }, refreshToken },
    });
    if (!token) {
      // TODO: throw error
      throw new Error('Invalid refresh token - id error');
    }
  }

  async getInfo(id: number) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    return {
      email: user.email,
      name: user.name,
      username: user.username,
      img: user.img,
      blog: user.blog,
      career: user.career,
      gen: user.generation,
      major: user.major + ' ' + user.studentId,
    };
  }

  async getMemberList() {
    const users = await this.userRepository.find({
      where: { accepted: true },
      order: { generation: 'DESC' },
    });
    return users.map((user) => {
      return {
        name: user.name,
        imgurl: user.img,
        email: user.email,
        blog: user.blog,
        gen: user.generation,
        major:
          user.major + ' ' + (user.generation !== 0 ? user.studentId : '교수'),
        career: user.career,
        badge: user.profileBadge,
      };
    });
  }

  async updateProfileImg(id: number, img: Express.Multer.File) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (user.img !== '') {
      await this.s3Service.delete(user.img);
    }

    let imgUrl = '';
    if (img === undefined || img === null) {
    } else {
      imgUrl = await this.s3Service.upload(img);
    }

    user.img = imgUrl;
    await this.userRepository.save(user);
  }

  async updateProfile(id: number, profileDto: ProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    user.email = profileDto.email;
    user.blog = profileDto.blog;
    user.career = profileDto.career;
    await this.userRepository.save(user);
  }

  async getGeneration() {
    const generation = await this.generationRepository.findOne({
      where: { id: 1 },
    });
    return generation.maxGen;
  }

  async checkAdminPw(pw: string) {
    const admin = await this.adminPasswordRepository.findOne({
      where: { id: 1 },
    });
    return pw === admin.passwd;
  }

  async updateAdminPw(pw: string) {
    const admin = await this.adminPasswordRepository.findOne({
      where: { id: 1 },
    });
    admin.passwd = pw;
    await this.adminPasswordRepository.save(admin);
  }

  async setMaxGen(gen: number) {
    const generation = await this.generationRepository.findOne({
      where: { id: 1 },
    });
    generation.maxGen = gen;
    await this.generationRepository.save(generation);
  }

  async removeAdmin(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    const admin = await this.adminRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (admin) await this.adminRepository.remove(admin);
    user.role = 'user';
    await this.userRepository.save(user);
  }

  async addAdmin(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    user.role = 'admin';
    await this.userRepository.save(user);
  }

  async setAdminRole(email: string, role: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');

    const admin = this.adminRepository.create({
      user,
      adminRole: role,
    });

    await this.adminRepository.save(admin);
  }

  async setProfileBadge(email: string, badge: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    user.profileBadge = badge;
    await this.userRepository.save(user);
  }

  async removeUser(studentId: number, gen: number, name: string) {
    const user = await this.userRepository.findOne({
      where: { studentId, generation: gen, name, password: IsNull() },
    });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    await this.userRepository.remove(user);
  }

  async addUser(body: {
    studentId: number | undefined;
    gen: number;
    name: string;
    email: string | undefined;
    major: string;
    career: string | undefined;
    blog: string | undefined;
    imgUrl: string | undefined;
  }) {
    const user = await this.userRepository.create({
      studentId: body.studentId,
      generation: body.gen,
      name: body.name,
      email: body.email,
      major: body.major,
      career: body.career,
      blog: body.blog,
      img: body.imgUrl,
    });
    await this.userRepository.save(user);
  }

  async getAcceptableUsers() {
    const users = await this.userRepository.find({
      where: { accepted: false, password: Not(IsNull()) },
    });
    return users;
  }

  async acceptUser(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    user.accepted = true;
    await this.userRepository.save(user);
  }

  async remove2User(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('일치하는 유저 정보가 없습니다.');
    await this.userRepository.remove(user);
  }
}
