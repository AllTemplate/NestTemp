import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger, runtime } from './runtime';
import createSwagger from './swagger';

async function bootstrap() {
  const { address, port } = runtime();
  const app = await NestFactory.create(AppModule);
  createSwagger(app);
  await app.listen(port, () => {
    logger(address, port);
  });
}
bootstrap();
