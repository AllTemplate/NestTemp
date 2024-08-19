import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RequestService } from './request/request.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [RequestService],
  exports: [RequestService, HttpModule],
})
export class SharedModule {}
