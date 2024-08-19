import createSwagger from './common/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, runtime } from './common/runtime';

async function bootstrap() {
  const { address, port } = runtime();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  createSwagger(app);
  await app.listen(port, () => {
    logger(address, port);
  });
}
bootstrap();
