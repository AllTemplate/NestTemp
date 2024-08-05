import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserServiceImpl } from './user.service.impl';
import { CreateUserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly UserServiceImpl: UserServiceImpl) {}

  @Get(':username')
  getUser(@Param('username') username: string) {
    return this.UserServiceImpl.getUser(username);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.UserServiceImpl.create(createUserDto);
  }
}
