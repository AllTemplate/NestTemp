import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from '../auth/local.guard';
import { CreateUserDto } from '../user/user.dto';
import { UserEntity } from '../user/user.entity';

@ApiTags('测试')
@Controller('test')
export class TestController {
  @Post('login')
  @ApiOperation({ summary: 'test' })
  @UseGuards(LocalGuard)
  getAllUser(@Body() _: CreateUserDto, @Req() req: Request & { user: UserEntity }) {
    if (req.user.userId) return [];
  }
}
