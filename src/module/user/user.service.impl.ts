import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserDto } from './user.dto';
import { BusinessException } from 'src/common/result/result';

@Injectable()
export class UserServiceImpl {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async getUser(username: string): Promise<UserEntity> {
    let a: any;
    console.log(a.x);
    return await this.userRepository.findOne({
      where: {
        username,
      },
    });
  }
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        username: createUserDto.username,
      },
    });
    if (user) throw new BusinessException('用户已存在');
    return await this.userRepository.save(createUserDto);
  }
}
