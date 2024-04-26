import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PublicMessage, unauthorizedMessage } from "src/common/messages/index.message";

@Injectable()
export class TokenService {
    constructor(private jwtService: JwtService) { }
    generateRgisterToken(payload: { userId: number }) {
        try {
            const secret = process.env.JWT_REGISTER_SECRET;
            const expiresIn = 1000 * 60 * 2
            return this.jwtService.sign(payload, { secret, expiresIn })
        } catch (error) {
            throw new UnauthorizedException(PublicMessage.processFailed);
        }
    }
    checkRgisterToken(token: string) {
        try {
            const secret = process.env.JWT_REGISTER_SECRET;
            return this.jwtService.verify(token, { secret })
        } catch (error) {
            throw new UnauthorizedException(unauthorizedMessage.invalid);
        }
    }
    generateAccessToken(payload: { userId: number }) {
        try {
            const secret = process.env.JWT_ACCESSTOKEN_SECRET;
            const expiresIn = 1000 * 60 * 60 * 24 * 30;
            return this.jwtService.sign(payload, { secret, expiresIn })
        } catch (error) {
            throw new UnauthorizedException(PublicMessage.processFailed);
        }
    }
    checkAccessToken(token: string) {
        try {
            const secret = process.env.JWT_ACCESSTOKEN_SECRET;
            return this.jwtService.verify(token, { secret })
        } catch (error) {
            throw new UnauthorizedException(unauthorizedMessage.invalid);
        }
    }
}