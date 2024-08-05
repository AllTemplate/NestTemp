import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, runtime } from './runtime';
import createSwagger from './swagger';
import { HttpExceptionFilter } from './common/filter/http.exception.filter';
import { ResultTransformInterceptor } from './common/interceptor/result.Interceptor';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filter/base.exception';

async function bootstrap() {
  const { address, port } = runtime();
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new GlobalExceptionFilter(httpAdapter));
  app.useGlobalInterceptors(new ResultTransformInterceptor());
  app.enableCors();
  createSwagger(app);
  await app.listen(port, () => {
    logger(address, port);
  });
}
bootstrap();
