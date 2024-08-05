import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from '../logger';

@Injectable()
export class ResultTransformInterceptor implements NestInterceptor {
  private readonly loggerService: LoggerService;
  constructor() {
    this.loggerService = new LoggerService();
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // const request = context.switchToHttp().getRequest();
    // const { method, originalUrl, body, query, params, ip } = request;
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          msg: 'success',
        };
      }),
    );
  }
}
