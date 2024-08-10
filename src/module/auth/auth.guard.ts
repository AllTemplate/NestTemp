import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BusinessException } from 'src/common/filter/result';
import { LoggerService } from 'src/common/logger';

@Injectable()
export class AuthGuard implements CanActivate {
  private reflector: Reflector;
  private loggerService: LoggerService;
  constructor() {
    this.reflector = new Reflector();
    this.loggerService = new LoggerService();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()]);
    console.log('isPublic', isPublic);
    this.loggerService.error('进入拦截器', 'asd');
    // if (isPublic) {
    //   return true;
    // }
    return true;
    // return super.canActivate(context);
    // const request = context.switchToHttp().getRequest();
    // const { authorization } = request.headers;
    // const { route, method } = request;
    // let a = true;
    // if (a) {
    //   throw new BusinessException('没有权限', HttpStatus.UNAUTHORIZED);
    // } else {
    //   return true;
    // }
  }
}
