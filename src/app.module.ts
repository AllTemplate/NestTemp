import config from './config';
import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { TestModule } from './module/test/test.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResultTransformInterceptor } from './common/interceptor/result.Interceptor';
import { GlobalExceptionFilter } from './common/filter/global.exception.filter';
import { DynamicGuard } from './common/guard/dynamic.guard';
import { AdminJwtAuthGuard } from './common/guard/admin.jwt.guard';
import { ClientAuthGuard } from './common/guard/client.jwt.guard';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [config],
      envFilePath: [process.env.NODE_ENV == 'production' ? 'env/.env.production' : 'env/.env.development'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (ConfigService: ConfigService) => ConfigService.get('PostgreSQL'),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    TestModule,
  ],
  providers: [
    AdminJwtAuthGuard,
    ClientAuthGuard,
    { provide: APP_GUARD, useClass: DynamicGuard },
    { provide: APP_INTERCEPTOR, useClass: ResultTransformInterceptor },
    { provide: APP_PIPE, useClass: ValidationPipe },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
