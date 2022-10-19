import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    console.log('initialize JwtStrategy');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      ignoreExpiration: false,
      secretOrKey: process.env.AUTH_JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return { Id: payload.sub, username: payload.username };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
