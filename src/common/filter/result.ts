import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, code: number = 400) {
    super({ message, code }, HttpStatus.OK);
  }
}
