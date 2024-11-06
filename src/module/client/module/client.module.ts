import { Logger, Module } from '@nestjs/common';

export const clientModuleList = [];

@Module({
  imports: [...clientModuleList],
  providers: [Logger],
})
export class ClientModule {}
