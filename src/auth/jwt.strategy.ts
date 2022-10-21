import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { UserDto } from '../users/users.dto';

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
    return {
      id: payload.sub,
      email: payload.email,
      username: payload.username,
      roles: payload.roles,
    } as UserDto;
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
