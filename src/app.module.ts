import config from './config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloModule } from './module/hello/hello.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development'],
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ConfigService.get('PostgreSQL'),
      inject: [ConfigService],
    }),
    HelloModule,
  ],
})
export class AppModule {}
