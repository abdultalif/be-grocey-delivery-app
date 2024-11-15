import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ErrorFilter } from './common/filters/error.filter';
import { ConfigService } from '@nestjs/config';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new ErrorFilter());
  const configService = app.get(ConfigService);
  app.use(
    cors({
      origin: true,
      credentials: true,
      preflightContinue: false,
      methods: 'GET, POST, PUT, PATCH, DELETE, HEAD',
      allowedHeaders:
        'Content-Type, Authorization, Origin, X-Requested-With, Accept',
    }),
  );

  await app.listen(configService.get('PORT'));
}
bootstrap();
