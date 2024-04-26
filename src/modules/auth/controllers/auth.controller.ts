import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { apiTagsName } from 'src/common/enum/apiTags.enum';
import { ApiConsumesType } from 'src/common/enum/ApiConsumesType.enum';
import { checkRegisterByOtpDto, checkRegisterByPasswordDto, RegisterDto } from '../dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags(apiTagsName.Auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  @ApiConsumes(ApiConsumesType.urlEncoded, ApiConsumesType.json)
  register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    return this.authService.register(registerDto, res);
  }

  @Post("/check-register-otp")
  @ApiConsumes(ApiConsumesType.urlEncoded, ApiConsumesType.json)
  checkRegisterByOtp(@Body() codeDto: checkRegisterByOtpDto) {
    return this.authService.checkRegisterByOtp(codeDto.code);
  }

  @Post("/check-register-pass")
  @ApiConsumes(ApiConsumesType.urlEncoded, ApiConsumesType.json)
  checkRegisterByPassword(@Body() passwordDto: checkRegisterByPasswordDto) {
    return this.authService.checkRegisterByPassword(passwordDto);
  }


}
