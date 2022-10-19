import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
