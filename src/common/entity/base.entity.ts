import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid', { comment: '唯一id' })
  id: string;

  @CreateDateColumn({
    type: 'date',
    name: 'created_at',
    comment: '创建时间',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'date',
    name: 'updated_at',
    comment: '更新时间',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    type: 'date',
    name: 'deleted_at',
    comment: '删除时间',
  })
  deletedAt: Date;
}
