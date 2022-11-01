import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../roles/roles';
import { CommentEntity } from '../comments/comments.entity';

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
  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: Comment[];
}
