import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles';
import { RefreshDto, RefreshPayload, RegisterDto } from './auth.dto';
import { UserDto } from '../users/users.dto';
import { randomUUID } from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private mailService: MailService,
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registration(registerDto: RegisterDto) {
    if (await this.userService.findByUsername(registerDto.username)) {
      return {
        success: false,
        message: 'This username is taken',
      };
    }

    if (await this.userService.findByEmail(registerDto.email)) {
      return {
        success: false,
        message: 'User with this email already exists',
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
      email: registerDto.email.toLowerCase(),
      isActivated: false,
      refreshToken: null,
      activationCode: randomUUID(),
      username: registerDto.username,
      hashPassword: await bcrypt.hash(registerDto.password, 10),
      roles: [Role.User],
    } as User;
    const created = await this.userService.create(user);
    await this.mailService.sendActivationMail(
      registerDto.email,
      `${process.env.API_URL}/auth/activation/${user.activationCode}`,
    );
    return { success: true, message: 'Registration is successful' };
  }

  async validateUser(username: string, pass: string): Promise<UserDto | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.hashPassword))) {
      const result = {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
      } as UserDto;
      return result;
    }
    return null;
  }

  async activate(activationCode: string) {
    await this.userService.activate(activationCode);
  }

  async login(user: UserDto, userAgent: any) {
    const accessPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };
    const refreshPayload = {
      sub: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      userAgent: userAgent,
      random: Math.random().toString(),
    } as RefreshPayload;

    const res = {
      accessToken: this.jwtService.sign(accessPayload),
      refreshToken: this.jwtService.sign(refreshPayload, {
        expiresIn: '2 days',
        secret: process.env.AUTH_JWT_REFRESH_SECRET,
      }),
    };

    await this.userService.updateRefreshToken(user.id, res.refreshToken);
    return res;
  }

  async refresh({ refreshToken }: RefreshDto, userAgent: any) {
    let refreshPayload: RefreshPayload;
    try {
      refreshPayload = this.jwtService.verify(refreshToken, {
        secret: process.env.AUTH_JWT_REFRESH_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException(e, 'jwt expired');
    }

    const user = await this.userService.findById(refreshPayload.sub);
    if (user.refreshToken != refreshToken)
      throw new UnauthorizedException(null, 'refresh token is obsolete');
    return await this.login(user, userAgent);
  }

  async logout(user: UserDto) {
    await this.userService.updateRefreshToken(user.id, null);
  }
}
