import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles';

export class UserDto {
  id: number | null;
  username: string;
  email: string;
  roles: Role[];
}
