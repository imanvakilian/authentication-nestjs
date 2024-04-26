import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TokenService } from './services/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { GoogleAuthController } from './controllers/google.controller';
import { GoogleStrategy } from './services/google.service';
import { mailmodule } from './mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OtpEntity]),
    UserModule,
    mailmodule
  ],
  controllers: [AuthController, GoogleAuthController],
  providers: [AuthService, TokenService, JwtService, UserService, GoogleStrategy],
})
export class AuthModule {}
