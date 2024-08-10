import { Injectable, Optional } from '@nestjs/common';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { AuthModuleOptions, PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private readonly authService: AuthService,
    @Optional() options: AuthModuleOptions,
  ) {
    const params: StrategyOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JwtSecret'),
    };
    super({
      ...options,
      ...params,
    });
  }

  async validate(user: UserEntity): Promise<{ jwtUser: UserEntity }> {
    console.log('进入jwt策略', user);
    const validateUser = await this.authService.validateTokenJwtStrategy(user.userId);
    return {
      jwtUser: validateUser,
    };
  }
}
