import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerService } from '../logger';

@Injectable()
export class ResTransformInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl, body, query, params, ip } = request;
    return next.handle().pipe(
      map((data) => {
        const resData = {
          data,
          code: 200,
          msg: 'success',
        };
        this.loggerService.success(
          JSON.stringify({
            req: {
              method,
              url: originalUrl,
              body,
              query,
              params,
              ip,
            },
            res: resData,
          }),
          '',
        );
        return resData;
      }),
    );
  }
}
