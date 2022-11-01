import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles';

export class UserDto {
  id: number;
  username: string;
  email: string;
  roles: Role[];
}

export class UserPublicDto {
  id: number;
  username: string;
}
