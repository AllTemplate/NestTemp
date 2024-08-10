import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from '../auth/local.guard';
import { UserEntity } from './user.entity';
import { AuthService } from '../auth/auth.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('user')
@ApiTags('用户')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: '登录' })
  @UseGuards(LocalGuard)
  login(@Body() _: LoginUserDto, @Req() req: Request & { user: UserEntity }) {
    return this.authService.signToken(req.user);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @ApiOperation({ summary: '查询用户信息' })
  getUserProfile(@Req() req: Request & { user: { jwtUser: UserEntity } }) {
    return req.user.jwtUser.username;
  }
}
