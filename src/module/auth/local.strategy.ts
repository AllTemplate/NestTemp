import { Injectable, Optional } from '@nestjs/common';
import { Strategy, IStrategyOptions } from 'passport-local';
import { AuthModuleOptions, PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    private readonly authService: AuthService,
    @Optional() options: AuthModuleOptions,
  ) {
    const params: IStrategyOptions = {
      usernameField: 'username',
      passwordField: 'password',
    };
    super({ ...params, ...options });
  }
  async validate(username: string, password: string): Promise<any> {
    console.log('进入jwt策略', username, password);
    return this.authService.validateUserLocalStrategy({
      username,
      password,
    });
  }
}
