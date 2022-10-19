import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Req,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.strategy';
import { LocalAuthGuard } from './local.strategy';
import { RegisterDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  async registration(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user, req.headers['user-agent']);
  }

  //
  // @Post()
  // async refresh() {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
