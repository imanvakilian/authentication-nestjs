import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { isJWT } from "class-validator";
import { Request } from "express";
import { Observable } from "rxjs";
import { unauthorizedMessage } from "src/common/messages/index.message";
import { AuthService } from "../services/auth.service";

export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService) { }
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest<Request>();
        const { authorization } = req.headers;
        if (!authorization || !isJWT(authorization)) throw new UnauthorizedException(unauthorizedMessage.shouldLogin);
        const [bearer, token] = authorization.split(" ")[1];
        if (bearer.toLocaleLowerCase() !== "bearer") throw new UnauthorizedException(unauthorizedMessage.failed);
        const user = await this.authService.validateTokenForGuard(token);
        req.user = user;
        return true;
    }
}