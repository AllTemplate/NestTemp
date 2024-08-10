import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalGuard } from '../auth/local.guard';
import { CreateUserDto } from '../user/user.dto';

@ApiTags('测试')
@Controller('test')
export class TestController {
  @Post('login')
  @ApiOperation({ summary: 'test' })
  @UseGuards(LocalGuard)
  getAllUser(@Body() _: CreateUserDto, @Req() req: Request & { account: any; user: any }) {
    console.log('req.account', req.account);
    console.log('req.user', req.user);
  }
}
