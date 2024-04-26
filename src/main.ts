import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { initSwagger } from './config/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from "cookie-parser"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  initSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.COOKIE_PARSER_SECRET))
  const { PORT } = process.env;
  await app.listen(PORT, () => {
    console.log(`server run > http://localhost:${PORT}`);
    console.log(`server run > http://localhost:${PORT}/swagger`);

  });
}
bootstrap();
