import { Injectable } from '@nestjs/common';
import { HelloService } from './hello.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelloEntity } from './hello.entity';

@Injectable()
export class HelloServiceImpl implements HelloService {
  constructor(
    @InjectRepository(HelloEntity)
    private readonly helloRepository: Repository<HelloEntity>,
  ) {}
  async getHappy(): Promise<HelloEntity[]> {
    return await this.helloRepository.find({});
  }
  async create(address: string): Promise<HelloEntity> {
    return await this.helloRepository.save({ address, balance: 12 });
  }
}
