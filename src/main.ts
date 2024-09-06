import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { create } from 'domain';
import { ConfigService } from '@nestjs/config';
import { get } from 'http';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'))
  app.setViewEngine('ejs');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.enableCors(
    {
      "origin": "*",
      "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
      "preflightContinue": false,
      "optionsSuccessStatus": 204
    }
  )

  await app.listen(configService.get<string>('PORT'));

}
bootstrap();
