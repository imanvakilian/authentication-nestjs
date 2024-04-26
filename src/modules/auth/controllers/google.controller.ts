import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";
import { apiTagsName } from "src/common/enum/apiTags.enum";
import { AuthService } from "../services/auth.service";

@Controller("/auth/google")
@ApiTags(apiTagsName.google)
@UseGuards(AuthGuard("google"))
export class GoogleAuthController {
    constructor(
        private readonly authService: AuthService, 
    ) {}
    @Get()
    googleAuth(@Req() req) {

    }
    @Get("/redirect")
    googleRedirect(@Req() req) {
        return this.authService.googleService(req.user);
    }
}