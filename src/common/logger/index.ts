import { Logger, configure, getLogger } from 'log4js';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LoggerService {
  private readonly businessLogger: Logger;
  private readonly unknownLogger: Logger;
  constructor() {
    configure({
      appenders: {
        console: {
          type: 'console',
        },
        business: {
          type: 'dateFile',
          filename: path.resolve('./logs', 'business.log'),
          pattern: 'yyyy-MM-dd',
          keepFileExt: true,
          alwaysIncludePattern: true,
          numBackups: 10,
        },
        unknown: {
          type: 'dateFile',
          filename: path.resolve('./logs', 'unknown.log'),
          pattern: 'yyyy-MM-dd',
          keepFileExt: true,
          alwaysIncludePattern: true,
          numBackups: 10,
        },
      },
      categories: {
        default: {
          appenders: ['console'],
          level: 'info',
        },
        business: {
          appenders: ['console', 'business'],
          level: 'info',
        },
        unknown: {
          appenders: ['console', 'unknown'],
          level: 'error',
        },
      },
    });
    this.businessLogger = getLogger('business');
    this.unknownLogger = getLogger('unknown');
  }

  error(message: string, trace: string, type: 'business' | 'unknown') {
    if (type === 'business') {
      this.businessLogger.error(message, trace);
    } else {
      this.unknownLogger.error(message, trace);
    }
  }
}
