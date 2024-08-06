import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(msg: string, code: number = 400) {
    super({ msg, code }, HttpStatus.OK);
  }
}
