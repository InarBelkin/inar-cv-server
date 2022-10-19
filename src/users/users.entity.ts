import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number | null;
  @Column()
  username: string;
  @Column()
  hashPassword: string;
  @Column('text', { array: true })
  roles: Role[];
  @Column()
  refreshToken: string;
}
