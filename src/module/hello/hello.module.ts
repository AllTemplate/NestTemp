import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelloEntity } from './hello.entity';
import { HelloController } from './hello.controller';
import { HelloServiceImpl } from './hello.service.impl';

@Module({
  imports: [TypeOrmModule.forFeature([HelloEntity])],
  controllers: [HelloController],
  providers: [HelloServiceImpl],
  exports: [],
})
export class HelloModule {}
