import { getEnvFile } from '@/utils';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
dotenv.config({ path: getEnvFile() });

export const PostgreSQLConfig = {
  type: 'postgres',
  host: 'localhost',
  username: process.env.POSTGRES_USER as string,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT as unknown as number,
  database: process.env.POSTGRES_DB,
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
  autoLoadEntities: true,
  logging: false,
} as PostgresConnectionOptions & TypeOrmModuleOptions;
