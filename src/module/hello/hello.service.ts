import { HelloEntity } from './hello.entity';

export class HelloService {
  create: (address: string) => Promise<HelloEntity>;
  getHappy: () => Promise<HelloEntity[]>;
}
