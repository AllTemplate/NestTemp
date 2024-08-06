import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':username')
  @ApiOperation({ summary: '根据用户名查找用户' })
  getUser(@Param('username') username: string) {
    return this.userService.getUser(username);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('find')
  @ApiOperation({ summary: '查找' })
  @UseGuards(AuthGuard('local'))
  getAllUser() {
    return this.userService.findAll();
  }
}
