import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';
import { Post } from '../posts/post.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number | null;
  @Column()
  text: string;
  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;
}
