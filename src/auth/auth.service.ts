import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles';
import { RefreshDto, RefreshPayload, RegisterDto } from './auth.dto';
import { use } from 'passport';
import { UserDto } from '../users/users.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    if (await this.userService.findOneWholly(registerDto.username)) {
      return {
        success: false,
        message: 'This username is taken',
      };
    }

    if (
      !new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$').test(
        registerDto.password,
      )
    ) {
      return {
        success: false,
        message:
          'Password must have minimum eight characters, at least one letter and one number:',
      };
    }

    const user = {
      id: null,
      username: registerDto.username,
      hashPassword: await bcrypt.hash(registerDto.password, 10),
      roles: [Role.User],
    } as User;
    const created = await this.userService.create(user);
    return { success: true, message: 'Registration is successful' };
  }

  async validateUser(username: string, pass: string): Promise<UserDto | null> {
    const user = await this.userService.findOneWholly(username);
    if (user && (await bcrypt.compare(pass, user.hashPassword))) {
      const { hashPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: UserDto, userAgent: any) {
    const accessPayload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    const refreshPayload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
      userAgent: userAgent,
      random: Math.random().toString(),
    } as RefreshPayload;

    const res = {
      accessToken: this.jwtService.sign(accessPayload),
      refreshToken: this.jwtService.sign(refreshPayload, {
        expiresIn: '2 days',
      }),
    };

    await this.userService.updateRefreshToken(user.id, res.refreshToken);
    return res;
  }

  async refresh({ refreshToken }: RefreshDto, userAgent: any) {
    let refreshPayload: RefreshPayload;
    try {
      refreshPayload = this.jwtService.verify(refreshToken);
    } catch (e) {
      throw new UnauthorizedException(e, 'jwt expired');
    }

    const user = await this.userService.findOneById(refreshPayload.sub);
    if (user.refreshToken != refreshToken)
      throw new UnauthorizedException(null, 'refresh token is obsolete');
    return await this.login(user, userAgent);
  }

  async logout(user: UserDto) {
    await this.userService.updateRefreshToken(user.id, null);
  }
}
