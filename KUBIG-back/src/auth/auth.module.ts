import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategy/user.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import UserEntity from './entity/user.entity';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtStrategy as RefreshStrategy } from './strategy/refreshToken.strategy';
import CodeEntity from './entity/code.entity';
import TokenEntity from './entity/token.entity';
import { S3Module } from 'src/s3/s3.module';
import GenerationEntity from './entity/generation.entity';
import AdminEntity from './entity/admin.entity';
import AdminPasswordEntity from './entity/adminPw.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CodeEntity,
      TokenEntity,
      GenerationEntity,
      AdminEntity,
      AdminPasswordEntity,
    ]),
    JwtModule.register({}),
    S3Module,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
