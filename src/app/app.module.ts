import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { initTypeOrm } from 'src/config/typeorm.config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { mailmodule } from 'src/modules/auth/mail.module';
import { CustomHttpModule } from 'src/modules/http/http.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), ".env")
    }),
    TypeOrmModule.forRoot(initTypeOrm()),
    AuthModule,
    UserModule,
    mailmodule,
    CustomHttpModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
