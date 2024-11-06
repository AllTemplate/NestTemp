import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BusinessException } from '../filter/result';
import { AuthGuard } from '@nestjs/passport';
import { ADMIN_JWT_AUTH_KEY } from './constant/admin.constant';
import { ADMIN_NO_AUTH_KEY } from '../decorator/admin';

@Injectable()
export class AdminJwtAuthGuard extends AuthGuard(ADMIN_JWT_AUTH_KEY) implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(ADMIN_NO_AUTH_KEY, [context.getHandler(), context.getClass()]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) {
      throw new BusinessException('admin-没有权限', HttpStatus.UNAUTHORIZED);
    } else {
      return super.canActivate(context) as boolean;
    }
  }
}
