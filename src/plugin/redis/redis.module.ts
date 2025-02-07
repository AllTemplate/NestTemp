import { Module, DynamicModule, Global, Provider } from '@nestjs/common';
import { RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';
import { REDIS_CLIENTS } from './redis.constant';
import Redis, { RedisOptions } from 'ioredis';

@Global()
@Module({})
export class RedisModule {
  static forRoot(options: RedisModuleOptions): DynamicModule {
    const redisProvider: Provider = {
      provide: REDIS_CLIENTS,
      useValue: new Redis(options),
    };
    return {
      module: RedisModule,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }

  static forRootAsync(options: RedisModuleAsyncOptions): DynamicModule {
    const { imports, inject, useFactory } = options;
    const redisProvider: Provider = {
      provide: REDIS_CLIENTS,
      useFactory: async (...args): Promise<Redis> => {
        const redisOptions: RedisOptions = await useFactory(...args);
        const redisClient = await new Redis(redisOptions);
        return redisClient;
      },
      inject,
    };
    return {
      module: RedisModule,
      imports,
      providers: [redisProvider],
      exports: [redisProvider],
    };
  }
}
