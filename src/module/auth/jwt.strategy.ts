import { Injectable, Optional } from '@nestjs/common';
import { Strategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { AuthModuleOptions, PassportStrategy } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

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

  async validate(userId: string): Promise<boolean> {
    console.log('进入jwt策略', userId);
    const user = await this.authService.validateTokenJwtStrategy(userId);
    if (!user) {
      return false;
    }
    return true;
  }
}
