import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { SendEmailService } from "./services/sendOtpEmail.service";

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: `${process.env.EMAIL_HOST}`,
                port: process.env.EMAIL_PORT,
                auth: {
                    user: `${process.env.EMAIL_USERNAME}`,
                    pass: `${process.env.EMAIL_PASSWORD}`,
                }
            }
        }),
    ],
    controllers: [],
    providers: [SendEmailService],
    exports: [SendEmailService]
})

export class mailmodule { }