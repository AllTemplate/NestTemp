import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { RedisModuleOptions } from 'src/plugin/redis/redis.interface';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as fs from 'fs';
import * as path from 'path';

const file = path.resolve(__dirname, '../../api_client_key.pem');
// 商户 API 证书密钥
const privateKey = fs.readFileSync(file, 'utf-8');
export default () => ({
  PostgreSQL: {
    type: 'postgres',
    host: 'localhost',
    username: process.env.POSTGRES_USER as string,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT as unknown as number,
    database: process.env.POSTGRES_DB,
    synchronize: process.env.NODE_ENV === 'development' ? true : false,
    autoLoadEntities: true,
    logging: false,
  } as PostgresConnectionOptions & TypeOrmModuleOptions,
  ClientJwtSecret: process.env.CLIENT_JWT_SECRET,
  AdminJwtSecret: process.env.ADMIN_JWT_SECRET,
  AdminSwaggerEntrance: 'swagger/admin',
  ClientSwaggerEntrance: 'swagger/client',
  WXMiniApp: {
    appid: process.env.WX_APPID,
    appSecret: process.env.WX_AppSecret,
  },
  WxPay: {
    mchid: process.env.WX_PAY_MCH_ID,
    rsaSerialNo: process.env.WX_PAY_RSA_SERIAL_NUMBER,
    apiV3Secret: process.env.WX_PAY_API_V3_SECRET,
    wxPayPlatformSerialNo: process.env.WX_PAY_PLATFORM_SERIAL_NO,
    privateKey,
  },
  Redis: {
    host: 'localhost',
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USER,
    port: process.env.REDIS_PORT as unknown as number,
  } as RedisModuleOptions,
  OSS: {
    region: process.env.OSS_REGION,
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET,
  },
});
