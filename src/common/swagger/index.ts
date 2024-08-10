import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { knife4jSetup } from 'nestjs-knife4j2';

const swaggerOptions = new DocumentBuilder()
  .setTitle('nest api for swagger')
  .setDescription('搭配swagger构建nest应用')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    in: 'headers',
    name: 'authorization',
  })
  .build();

const createSwagger = (app) => {
  const entrance = 'swagger'
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(entrance, app, document);
  knife4jSetup(app, [
    {
      name: '3.X版本',
      url: `${entrance}-json`,
      swaggerVersion: '3.0',
      location: `${entrance}-json`,
    },
  ]);
};
export default createSwagger;
