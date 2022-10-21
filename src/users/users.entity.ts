import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number | null;
  @Column()
  username: string;
  @Column()
  email: string;
  @Column()
  isActivated: boolean;
  @Column()
  activationCode: string;
  @Column()
  hashPassword: string;
  @Column('text', { array: true })
  roles: Role[];
  @Column({ nullable: true })
  refreshToken: string | null;
}
