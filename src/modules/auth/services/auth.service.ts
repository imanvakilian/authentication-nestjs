import { BadRequestException, Inject, Injectable, NotFoundException, Scope, UnauthorizedException } from '@nestjs/common';
import { checkRegisterByPasswordDto, RegisterDto } from '../dto/auth.dto';
import { authType } from '../enum/auth-type.enum';
import { conflictMessage, PublicMessage, unauthorizedMessage } from 'src/common/messages/index.message';
import { authMethod } from '../enum/auth-method.enum';
import { isEmail, isJWT, isMobilePhone, isString, length } from 'class-validator';
import { UserService } from '../../user/user.service';
import { UserEntity } from '../../user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpEntity } from '../../user/entities/otp.entity';
import { generateOtp, randomId } from 'src/common/utils/functions.utit';
import { Request, Response } from 'express';
import { TokenService } from './token.service';
import { REQUEST } from '@nestjs/core';
import { IgoogleService } from '../types/auth.types';
import { SendEmailService } from './sendOtpEmail.service';
import { CustomHttpService } from 'src/modules/http/http.service';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly sendEmailService: SendEmailService,
        private readonly httpService: CustomHttpService,
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        @InjectRepository(OtpEntity) private otpRepository: Repository<OtpEntity>,
        @Inject(REQUEST) private req: Request,
    ) { }
    // ===============================register=====================================
    async register(registerDto: RegisterDto, res: Response) {
        const { username, type, method } = registerDto;
        this.validateMethodAndUsername(method, username);
        let result: { userId: number, code: string, hasPassword?: boolean, value?: string };
        switch (type) {
            case authType.signUp:
                result = await this.singUp(method, username);
                break;
            case authType.signIn:
                result = await this.singIn(method, username);
                break;
            default:
                throw new BadRequestException(PublicMessage.processFailed);
        }
        const { code, userId, hasPassword, value } = result;
        console.log(result);

        const token = this.tokenService.generateRgisterToken({ userId });
        res.cookie(process.env.REGISTER_COOKIE_NAME, token, { maxAge: 1000 * 60 * 2 });
        let message = "http://localhost:3000/auth/check-register-pass";
        if (hasPassword) {
            return res.json({
                message
            });
        }
        // =============================== services to send otp =======================================================================================================
        // if (method === authMethod.email) await this.sendEmailService.sendotpToEmail(value, code);
        // else await this.httpService.sendOtpMobile(value, code);
        // =============================== services to send otp =======================================================================================================
        message = PublicMessage.otpSent;
        return res.json({
            message,
        });
    }

    async singUp(method: string, username: string) {
        if (method === authMethod.username) throw new BadRequestException(PublicMessage.invalidUsername);
        const query = method === authMethod.mobile ? { mobile: username } : { email: username };
        await this.userService.checExistByQuery(query);
        const user = this.userRepository.create(query);
        await this.userRepository.save(user);
        user.username = `u_${user.id}`;
        const otp = await this.makeOtp(user.id, method);
        user.otpId = otp.id;
        await this.userRepository.save(user);
        let value = method === authMethod.mobile ? user.mobile : user.email;
        return {
            userId: user.id,
            code: otp.code,
            value,
        }
    }

    async singIn(method: string, username: string) {
        const isMobile = method === authMethod.mobile ? { mobile: username } : null;
        const isEmail = method === authMethod.email ? { email: username } : null;
        const query = isMobile ?? isEmail ?? { username };
        const user = await this.userService.findOneByQuery(query);
        if (isEmail) user.verifyed_email = false;
        if (!isMobile && !user.password) user.verifyed_mobile = false;
        const otp = await this.remakeOtp(user.id, method);
        let hasPassword = false;
        if (!isMobile && !isEmail && user.password) hasPassword = true;
        let value;
        if (!hasPassword) value = method === authMethod.mobile ? user.mobile : user.email;
        return {
            userId: user.id,
            code: otp.code,
            hasPassword,
            value,
        }
    }
    // =============================register====================================
    // =============================google service====================================
    async googleService(userInformation: IgoogleService) {
        const { email, firstname, lastname } = userInformation;
        let user = await this.userRepository.findOneBy({ email });
        if (!user) {
            user = this.userRepository.create({
                email,
                username: `${email.split("@")[0]}${randomId}`,
                // or
                // username: `${firstname}${lastname}${randomId}`,
                verifyed_email: true,
            });
            await this.userRepository.save(user);
        }
        const accessToken = this.tokenService.generateAccessToken({ userId: user.id });
        // just for create otp and probable privention errors
        const { code, expires_in } = generateOtp();
        await this.otpRepository.insert({ code, expires_in, method: authMethod.email, userId: user.id });
        // ===========
        return {
            accessToken,
        }
    }
    // =============================google service====================================
    // =============================check register====================================
    async checkRegister() {
        const token = this.req?.cookies?.[process.env.REGISTER_COOKIE_NAME];
        if (!token || !isJWT(token)) throw new UnauthorizedException(unauthorizedMessage.somethingWrong);
        const { userId } = this.tokenService.checkRgisterToken(token);
        const user = await this.userService.findOneWithRelation(userId);
        return {
            user,
        }
    }
    async checkRegisterByOtp(code: string) {
        const { user } = await this.checkRegister();
        const now = new Date();
        if (user.otp.code !== code && now > user.otp.expires_in) throw new UnauthorizedException(unauthorizedMessage.invalid);
        const accessToken = this.tokenService.generateAccessToken({ userId: user.id });
        if (user.otp.method == authMethod.mobile) user.verifyed_mobile = true;
        if (user.otp.method == authMethod.email) user.verifyed_email = true;
        await this.userRepository.save(user);
        const message = PublicMessage.loggedIn;
        return {
            message,
            accessToken,
        }
    }
    async checkRegisterByPassword(passwordDto: checkRegisterByPasswordDto) {
        const { username, password } = passwordDto;
        const user = await this.userService.findOneByQuery({ username });
        if (user.password !== password) throw new UnauthorizedException(unauthorizedMessage.invalidPass);
        const accessToken = this.tokenService.generateAccessToken({ userId: user.id });
        const message = PublicMessage.loggedIn;
        return {
            message,
            accessToken,
        }
    }
    // =============================check register=======================================
    // ==============================help======================================
    validateMethodAndUsername(method: string, username: string) {
        switch (method) {
            case authMethod.mobile:
                if (isMobilePhone(username)) return username;
                throw new BadRequestException(PublicMessage.invalidUsername);
            case authMethod.email:
                if (isEmail(username)) return username;
                throw new BadRequestException(PublicMessage.invalidUsername);
            case authMethod.username:
                if (isString(username) && length(username, 1, 70)) return username;
                throw new BadRequestException(PublicMessage.invalidUsername);
            default:
                throw new BadRequestException(PublicMessage.processFailed);
        }
    }

    async makeOtp(userId: number, method: string) {
        await this.checkExistOtp(userId);
        const { code, expires_in } = generateOtp();
        let otp = this.otpRepository.create({ code, expires_in, method, userId });
        await this.otpRepository.save(otp);
        return otp;
    }

    async remakeOtp(userId: number, method: string) {
        const otp = await this.findOneOtp(userId);
        const now = new Date();
        if (otp.expires_in > now) throw new BadRequestException(PublicMessage.processFailed);
        const { code, expires_in } = generateOtp();
        otp.code = code;
        otp.expires_in = expires_in;
        otp.method = method;
        await this.otpRepository.save(otp);
        return otp;
    }

    async checkExistOtp(userId: number) {
        const otp = await this.otpRepository.findOneBy({ userId });
        if (otp) throw new BadRequestException(PublicMessage.processFailed);
        return null;
    }

    async findOneOtp(userId: number) {
        const otp = await this.otpRepository.findOneBy({ userId });
        if (!otp) throw new NotFoundException(PublicMessage.processFailed);
        return otp;
    }

    async validateTokenForGuard(token: string) {
        const { userId } = this.tokenService.checkAccessToken(token);
        const user = await this.userRepository.findOneBy({id: userId});
        if(!user) throw new UnauthorizedException(unauthorizedMessage.failed);
        return user
    }
    // ======================help==========================================
}
