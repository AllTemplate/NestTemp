import { Logger, Module } from '@nestjs/common';

export const adminModuleList = [];

@Module({
  imports: [...adminModuleList],
  providers: [Logger],
})
export class AdminModule {}
