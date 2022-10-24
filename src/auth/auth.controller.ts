import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Redirect,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.strategy';
import { LocalAuthGuard } from './local.strategy';
import { RefreshDto, RegisterDto } from './auth.dto';
import { Role } from '../roles/roles';
import { RequireJwtRoles } from '../roles/roles.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  async registration(@Body() registerDto: RegisterDto) {
    return await this.authService.registration(registerDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user, req.headers['user-agent']);
  }

  @Patch('refresh')
  async refresh(@Body() dto: RefreshDto, @Req() req) {
    return this.authService.refresh(dto, req.headers['user-agent']);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @RequireJwtRoles(Role.Admin)
  @Get('roles')
  testRoles(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logOut(@Req() req) {
    await this.authService.logout(req.user);
  }

  @Get('activation/:code')
  @Redirect(`${process.env.CLIENT_URL}`)
  async Activate(@Param('code') code: string) {
    await this.authService.activate(code);
  }
}
