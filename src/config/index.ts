import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export default () => ({
  PostgreSQL: {
    type: 'postgres',
    username: 'root',
    password: '123456',
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    synchronize: true,
    autoLoadEntities: true,
  } as PostgresConnectionOptions & TypeOrmModuleOptions,
});
