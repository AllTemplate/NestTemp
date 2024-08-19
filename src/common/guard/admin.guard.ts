import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BusinessException } from '../filter/result';

@Injectable()
export class AuthGuard implements CanActivate {
  private reflector: Reflector;
  constructor() {
    this.reflector = new Reflector();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [context.getHandler(), context.getClass()]);
    console.log('isPublic', isPublic);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) {
      throw new BusinessException('没有权限', HttpStatus.UNAUTHORIZED);
    } else {
      return true;
    }
  }
}
