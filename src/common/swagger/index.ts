import { adminModuleList } from '@/module/admin/module/admin.module';
import { clientModuleList } from '@/module/client/module/client.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from '@/config';

const adminOptions = new DocumentBuilder()
  .setTitle('nest api for swagger')
  .setDescription('管理端')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    in: 'headers',
    name: 'authorization',
  })
  .build();

const consumerOptions = new DocumentBuilder()
  .setTitle('nest api for swagger')
  .setDescription('客户端端')
  .setVersion('1.0')
  .addBearerAuth({
    type: 'http',
    in: 'headers',
    name: 'authorization',
  })
  .build();

const createSwagger = (app) => {
  const { ClientSwaggerEntrance, AdminSwaggerEntrance } = config();
  const adminDocument = SwaggerModule.createDocument(app, adminOptions, {
    include: [...adminModuleList],
  });
  const clientDocument = SwaggerModule.createDocument(app, consumerOptions, {
    include: [...clientModuleList],
  });
  SwaggerModule.setup(AdminSwaggerEntrance, app, adminDocument);
  SwaggerModule.setup(ClientSwaggerEntrance, app, clientDocument);
};
export default createSwagger;
