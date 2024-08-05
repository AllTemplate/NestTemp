import { BadRequestException, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import type { ArgumentsHost } from '@nestjs/common';
import type { Response, Request } from 'express';
import { LoggerService } from '../logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const results = exception.getResponse() as any;
    const code = results.statusCode;

    // 返回的对象
    const jsonData = {
      code: code,
      message: results.message,
      data: null,
    };

    // 参数校验错误，默认都是BadRequestException
    const isArrayMessage = Array.isArray(results.message);
    const isValidationError = isArrayMessage && typeof results.message[0] === 'string' && results.message[0].includes('⓿');
    if (exception instanceof BadRequestException && isValidationError) {
      const message: Array<{ field: string; message: Array<string> }> = [];
      results.message.forEach((item) => {
        const [key, val] = item.split('⓿') as [string, string];
        const findData = message.find((item) => item.field === key);
        if (findData) {
          findData.message.push(val);
        } else {
          message.push({ field: key, message: [val] });
        }
      });

      jsonData.message = message;
    }

    // 记录日志
    const { method, originalUrl, body, query, params, ip } = request;
    this.loggerService.error(
      JSON.stringify({
        res: {
          code,
          status,
          message: jsonData.message,
        },
        req: {
          method,
          url: originalUrl,
          body,
          query,
          params,
          ip,
        },
      }),
      'http',
    );

    return response.status(status).json(jsonData);
  }
}
