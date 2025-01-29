import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AdminJwtAuthGuard } from './admin.jwt.guard';
import { ClientJwtAuthGuard } from './client.jwt.guard';

@Injectable()
export class DynamicGuard implements CanActivate {
  constructor(
    private readonly adminGuard: AdminJwtAuthGuard,
    private readonly clientGuard: ClientJwtAuthGuard,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;
    if (path.startsWith('/api/admin')) {
      return this.adminGuard.canActivate(context);
    } else if (path.startsWith('/api/client')) {
      return this.clientGuard.canActivate(context) as boolean;
    }
  }
}
