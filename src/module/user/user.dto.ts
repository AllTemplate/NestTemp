import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'Answers', description: '用户名', required: true })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ example: '123456', description: '密码', required: true })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}

export class UserInfoDto extends UserDto {
  @ApiProperty({ example: '1', description: '用户id', required: true })
  userId: string;
}

export class CreateUserDto extends UserDto {}

export class LoginUserDto extends UserDto {}
