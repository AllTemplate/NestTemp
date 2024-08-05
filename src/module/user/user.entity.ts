import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hello')
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id', comment: '唯一id' })
  userId: string;

  @Column({
    name: 'username',
    comment: '用户名',
  })
  username: string;

  @Column({
    name: 'nickname',
    comment: '密码',
  })
  password: string;
}
