import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './test.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TestController],
  providers: [],
  exports: [],
})
export class TestModule {}
