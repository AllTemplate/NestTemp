import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { AuthLoginDto } from './auth.dto';
import { compareSync } from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessException } from 'src/common/filter/result';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  // 校验用户身份（本地策略方式）
  async validateUserLocalStrategy(e: AuthLoginDto): Promise<UserEntity> {
    console.log('本地策略验证参数', e);
    // let sql = `select * from user where user.username = '${e.username}'`
    // const user: UserEntity = await this.userEntityRepository.query(sql)
    // 当实体类设置了隐藏列，如果想要查出来，要么使用原生查询，要么使用createQueryBuilder(),
    // createQueryBuilder()参数接收一个别名，如果不传入别名，那么就算使用了addSelect(),这个隐藏列也不会被查询出来
    const user: UserEntity = await this.userEntityRepository
      .createQueryBuilder('user')
      .select()
      .where(`user.username = '${e.username}'`)
      .addSelect('user.password')
      .getOne();
    if (!user) {
      throw new BusinessException('没有找到当前用户', 404);
    }
    const status = true;
    // const status = compareSync(e.password, user.password);
    if (!status) {
      throw new BusinessException('密码不正确', 400);
    }

    return user;
  }

  // 解密token(策略方式)
  async validateTokenJwtStrategy(userId: string): Promise<UserEntity> {
    return await this.userEntityRepository.findOne({ where: { userId } });
  }
}
