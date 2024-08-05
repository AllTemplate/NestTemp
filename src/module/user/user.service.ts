import { CreateUserDto } from './user.dto';
import { UserEntity } from './user.entity';
import { IUserServiceInterface } from './user.interface';
import { UserServiceImpl } from './user.service.impl';

export class UserService implements IUserServiceInterface {
  constructor(private readonly userServiceImpl: UserServiceImpl) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userServiceImpl.create(createUserDto);
  }
  async getUser(username: string): Promise<UserEntity> {
    return await this.userServiceImpl.getUser(username);
  }
}
