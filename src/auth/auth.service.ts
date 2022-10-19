import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/users.entity';
import { Role } from '../roles/roles';
import { RegisterDto } from './auth.dto';

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

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneWholly(username);
    if (user && (await bcrypt.compare(user.hashPassword, pass))) {
      const { hashPassword, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any, userAgent: any) {
    const accessPayload = { username: user.username, sub: user.Id.toString() };
    const refreshPayload = {
      userAgent: userAgent,
      random: Math.random().toString(),
    };

    return {
      access_token: this.jwtService.sign(accessPayload),
    };
  }
}
