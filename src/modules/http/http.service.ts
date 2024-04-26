import { HttpService } from "@nestjs/axios";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import QueryString from "qs";
import { catchError, lastValueFrom, map } from "rxjs";

@Injectable()
export class CustomHttpService {
    constructor(private httpService: HttpService) { }
    async sendOtpMobile(reciptor: string, code: string) {
        const url = process.env.KAVENEGAR_URL_API;
        const params = QueryString.stringify({
            reciptor,
            code,
            template: "verify",
        });
        const result = await lastValueFrom(this.httpService.get(`${url}?${params}`)
            .pipe(
                map((res) => res.data),
            )
            .pipe(
                catchError((err) => {
                    console.log(err);
                    throw new InternalServerErrorException("kavenegar error");
                })
            )
        );
        console.log(result);
        return result;
        
    }
}