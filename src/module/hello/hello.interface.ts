import { HelloEntity } from './hello.entity';

export interface HelloServiceInterface {
  create: (address: string) => Promise<HelloEntity>;
  getAll: () => Promise<HelloEntity[]>;
}
