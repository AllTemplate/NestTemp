import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';
import { LoggerService } from '../logger';

@Catch(Error)
export class GlobalExceptionFilter extends BaseExceptionFilter implements ExceptionFilter {
  private readonly loggerService: LoggerService;
  constructor(a) {
    super(a);
    this.loggerService = new LoggerService();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return this.catchHttpException(exception, host);
    }
    if (exception instanceof Error) {
      return this.catchError(exception, host);
    }
    // return super.catch(exception, host) // 使用 @Catch() 捕获全部抛出可能运行到此，但是如果不注入 HttpAdapterHost 依赖则 BaseExceptionFilter 会抛异常
  }

  catchError(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(HttpStatus.BAD_GATEWAY).json({
      error: 'ERROR!',
    });
    this.loggerService.error(exception.message, exception.stack);
  }

  catchHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
