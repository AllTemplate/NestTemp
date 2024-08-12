import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestController } from './test.controller';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/user.entity';

@Module({
  controllers: [TestController],
  providers: [UserEntity],
  exports: [],
})
export class TestModule {}
