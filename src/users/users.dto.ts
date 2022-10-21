import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles';

export class UserDto {
  id: number | null;
  username: string;
  roles: Role[];
}
