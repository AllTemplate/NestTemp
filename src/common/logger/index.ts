import { Logger, configure, getLogger } from 'log4js';
import { Injectable } from '@nestjs/common';
import * as path from 'path';
@Injectable()
export class LoggerService {
  private readonly businessLogger: Logger;
  private readonly unknownLogger: Logger;
  private readonly infoLogger: Logger;
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
        info: {
          type: 'dateFile',
          filename: path.resolve('./logs', 'info.log'),
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
        info: {
          appenders: ['console', 'info'],
          level: 'info',
        },
      },
    });
    this.businessLogger = getLogger('business');
    this.unknownLogger = getLogger('unknown');
    this.infoLogger = getLogger('info');
  }

  error(message: string, trace: string, type: 'business' | 'unknown') {
    if (type === 'business') {
      this.businessLogger.error(message, trace);
    } else {
      this.unknownLogger.error(message, trace);
    }
  }
  info(message: string, trace: string) {
    this.infoLogger.info(message, trace);
  }
}
