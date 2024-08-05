import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('hello')
export class HelloEntity extends BaseEntity {
  @Column({
    name: 'address',
    comment: '钱包地址',
  })
  address: string;

  @Column({
    name: 'balance',
    comment: '钱包余额',
  })
  balance: number;
}
