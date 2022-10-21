import { Role } from './roles';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { JwtAuthGuard } from '../auth/jwt.strategy';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const RequireJwtRoles = (...roles: Role[]) =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    UseGuards(RolesGuard),
    Roles(...roles),
  );
