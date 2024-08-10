import config from './config';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { TestModule } from './module/test/test.module';
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
    UserModule,
    AuthModule,
    TestModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
