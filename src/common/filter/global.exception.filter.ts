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
    const request = ctx.getRequest<Request>();
    const { method, originalUrl } = request;
    response.status(HttpStatus.BAD_GATEWAY).json({
      method,
      path: request.headers.host + originalUrl,
      message: exception.message,
    });
    this.loggerService.error(exception.message, exception.stack, 'unknown');
  }

  catchHttpException(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const results = exception.getResponse() as { msg: string; code: number };
    const { method, body, query, params, ip } = request;

    const resData = {
      code: results.code,
      statusCode: status,
      method,
      path: request.headers.host + request.url,
      msg: results.msg,
    };
    response.status(status).json(resData);
    this.loggerService.error(JSON.stringify({ ...resData, body, query, params, ip }), 'http', 'business');
  }
}
