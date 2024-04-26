import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { CustomHttpService } from "./http.service";

@Global()
@Module({
    imports: [
        HttpModule.register({ timeout: 10000 }),
    ],
    controllers: [],
    providers: [CustomHttpService],
    exports: [CustomHttpService],
})

export class CustomHttpModule {

}