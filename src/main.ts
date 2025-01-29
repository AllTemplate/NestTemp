import { logger, runtime } from './common/runtime';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import createSwagger from './common/swagger';
async function bootstrap() {
  const { address, port } = runtime();
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets('file', { prefix: '/file' });
  createSwagger(app);
  await app.listen(port, () => {
    logger(address, port);
  });
}
bootstrap();
