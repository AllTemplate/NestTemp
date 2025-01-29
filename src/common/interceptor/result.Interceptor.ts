import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException, ArgumentsHost } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResultTransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
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
  catch(exception: any, host: ArgumentsHost) {
    console.error('Exception caught in interceptor:', exception);
    throw new BadGatewayException('Something went wrong');
  }
}
