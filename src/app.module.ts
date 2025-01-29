import config from './config';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from './shared/shared.module';
import { PassportModule } from '@nestjs/passport';
import { ThrottlerGuard, ThrottlerModule, seconds } from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ResultTransformInterceptor } from './common/interceptor/result.Interceptor';
import { AdminModule } from './module/admin/module/admin.module';
import { GlobalExceptionFilter } from './common/filter/global.exception.filter';
import { RedisModule } from './plugin/redis';
import { DynamicGuard } from './common/guard/dynamic.guard';
import { AdminJwtAuthGuard } from './common/guard/admin.jwt.guard';
import { ClientJwtAuthGuard } from './common/guard/client.jwt.guard';
import { ClientModule } from './module/client/module/client.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      envFilePath: ['.env.development'],
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('PostgreSQL'),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('Redis'),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: () => ({
        errorMessage: '当前操作过于频繁，请稍后再试！',
        throttlers: [{ ttl: seconds(10), limit: 7 }],
      }),
    }),
    PassportModule,
    SharedModule,
    AdminModule,
    ClientModule,
  ],
  providers: [
    AdminJwtAuthGuard,
    ClientJwtAuthGuard,
    { provide: APP_GUARD, useClass: DynamicGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_PIPE, useFactory: () => new ValidationPipe({ transform: true }) },
    { provide: APP_INTERCEPTOR, useClass: ResultTransformInterceptor },
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
  ],
})
export class AppModule { }
