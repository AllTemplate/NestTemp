import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { AuthLoginDto } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/common/filter/result';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserLocalStrategy(e: AuthLoginDto): Promise<UserEntity> {
    const user: UserEntity = await this.userEntityRepository.findOne({ where: { username: e.username } });
    if (!user) {
      throw new BusinessException('没有找到当前用户', 404);
    }
    const status = e.password === user.password;
    if (!status) {
      throw new BusinessException('密码不正确', 400);
    }
    return user;
  }

  async validateTokenJwtStrategy(userId: string): Promise<UserEntity> {
    const user = await this.userEntityRepository.findOne({ where: { userId } });
    if (!user) {
      throw new BusinessException('没有找到当前用户', 404);
    }
    return user;
  }

  async signToken(user: UserEntity): Promise<string> {
    const token = this.jwtService.sign(
      { ...user },
      {
        secret: this.configService.get('JwtSecret'),
      },
    );
    return token;
  }
}
