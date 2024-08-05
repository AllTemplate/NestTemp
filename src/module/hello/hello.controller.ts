import { Controller, Get, Param } from '@nestjs/common';
import { HelloServiceImpl } from './hello.service.impl';

@Controller('hello')
export class HelloController {
  constructor(private readonly helloServiceImpl: HelloServiceImpl) {}

  @Get(':address')
  getHappy(@Param('address') address: string) {
    return this.helloServiceImpl.create(address);
  }

  @Get()
  hello() {
    return 'hello word';
  }
}
