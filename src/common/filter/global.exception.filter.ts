import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../logger';

@Catch(Error)
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly loggerService: LoggerService;
  constructor() {
    this.loggerService = new LoggerService();
  }

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return this.catchHttpException(exception, host);
    }
    if (exception instanceof Error) {
      return this.catchError(exception, host);
    }
  }

  catchError(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { user: any }>();
    const { method, originalUrl } = request;
    response.status(HttpStatus.BAD_GATEWAY).json({
      method,
      path: request.headers.host + originalUrl,
      message: exception.message,
      success: false,
    });
    this.loggerService.error(JSON.stringify({ message: exception.message, account: request?.user }), exception.stack, 'unknown');
  }

  catchHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { user: any }>();
    const statusCode = exception.getStatus();
    const results = exception.getResponse() as { message: string; code: number };
    const { method, body, query, params, ip } = request;
    const resData = {
      code: results.code,
      statusCode,
      method,
      path: request.headers.host + request.url,
      message: results.message,
      success: false,
    };
    response.status(statusCode).json(resData);
    this.loggerService.error(JSON.stringify({ ...resData, body, query, params, ip, account: request?.user }), 'http', 'business');
  }
}
