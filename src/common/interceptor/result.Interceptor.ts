import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException, ArgumentsHost } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResultTransformInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 200,
          success: true,
        };
      }),
    );
  }
  catch(exception, _: ArgumentsHost) {
    throw new BadGatewayException('Something went wrong');
  }
}
