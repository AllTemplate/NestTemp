import { Logger, configure, getLogger } from 'log4js';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
@Injectable()
export class LoggerService {
  private readonly logger: Logger;
  constructor() {
    configure({
      appenders: {
        console: {
          type: 'console',
        },
        app: {
          type: 'dateFile',
          filename: path.resolve('./logs', 'app.log'),
          pattern: 'yyyy-MM-dd',
          keepFileExt: true,
          alwaysIncludePattern: true,
          numBackups: 10,
        },
      },
      categories: {
        default: {
          appenders: ['console', 'app'],
          level: 'info',
        },
      },
    });
    this.logger = getLogger();
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }
  success(message: string, trace: string) {
    this.logger.info(message, trace);
  }
  fatal(message: string, trace: string) {
    this.logger.fatal(message, trace);
  }
}
