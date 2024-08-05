import { CreateUserDto } from './user.dto';
import { UserEntity } from './user.entity';

export interface IUserServiceInterface {
  create: (createUserDto: CreateUserDto) => Promise<UserEntity>;
  getUser: (username: string) => Promise<UserEntity>;
}
