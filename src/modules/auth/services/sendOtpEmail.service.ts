import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SendEmailService {
    constructor(private mailerService: MailerService) { }
    async sendotpToEmail(email: string, code: string) {
        await this.mailerService.sendMail({
            from: `${process.env.MY_EMAIL}`,
            to: email,
            subject: "send otp code for authentication",
            text: code,
        })
    }
}