import { Module, Global } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RequestService } from './request/request.service';
import { LoggerService } from '@/common/logger';

@Global()
@Module({
  imports: [HttpModule],
  providers: [RequestService, LoggerService],
  exports: [RequestService, HttpModule, LoggerService],
})
export class SharedModule { }
