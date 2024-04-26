import { ApiProperty } from "@nestjs/swagger";
import { authType } from "../enum/auth-type.enum";
import { authMethod } from "../enum/auth-method.enum";
import { IsString, Length } from "class-validator";

export class RegisterDto {
    @ApiProperty()
    username: string;
    @ApiProperty({ enum: authType })
    type: string;
    @ApiProperty({ enum: authMethod })
    method: string;
}

export class checkRegisterByOtpDto {
    @ApiProperty()
    @IsString()
    @Length(5, 5)
    code: string;
}

export class checkRegisterByPasswordDto {
    @ApiProperty()
    @IsString()
    username: string;
    @ApiProperty()
    @IsString()
    password: string;
}