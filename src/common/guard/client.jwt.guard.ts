import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { BusinessException } from '../filter/result';
import { CLIENT_NO_AUTH_KEY } from '../decorator/client';

@Injectable()
export class ClientJwtAuthGuard extends AuthGuard(CLIENT_NO_AUTH_KEY) implements CanActivate {
  constructor(private readonly reflector: Reflector) {
    super(reflector);
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const status = this.reflector.getAllAndOverride<boolean>(CLIENT_NO_AUTH_KEY, [context.getHandler(), context.getClass()]);
    if (status) return true;
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    if (!authorization) {
      throw new BusinessException('客户端没有权限', HttpStatus.UNAUTHORIZED);
    } else {
      return super.canActivate(context);
    }
  }
}
