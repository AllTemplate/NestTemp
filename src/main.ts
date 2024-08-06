import createSwagger from './swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, runtime } from './runtime';
import { ResultTransformInterceptor } from './common/interceptor/result.Interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filter/global.exception.filter';

async function bootstrap() {
  const { address, port } = runtime();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResultTransformInterceptor());
  app.enableCors();
  createSwagger(app);
  await app.listen(port, () => {
    logger(address, port);
  });
}
bootstrap();
