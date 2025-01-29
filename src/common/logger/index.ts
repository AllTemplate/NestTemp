import { Logger, configure, getLogger } from 'log4js';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LoggerService {
  private readonly businessLogger: Logger;
  private readonly unknownLogger: Logger;
  private readonly timedLogger: Logger;
  constructor() {
    configure({
      appenders: {
        console: {
          type: 'console',
        },
        time: {
          type: 'dateFile',
          filename: path.resolve('./logs', 'timed.log'),
          pattern: 'yyyy-MM-dd',
          keepFileExt: true,
          alwaysIncludePattern: true,
          numBackups: 10,
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
        time: {
          appenders: ['console', 'time'],
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
    this.timedLogger = getLogger('time');
  }

  error(message: string, trace: string, type: 'business' | 'unknown') {
    if (type === 'business') {
      this.businessLogger.error(message, trace);
    } else {
      this.unknownLogger.error(message, trace);
    }
  }

  info(message: string, trace: string) {
    this.timedLogger.info(message, trace);
  }
}
