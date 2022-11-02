import { UserPublicDto } from '../users/users.dto';

export interface CommentCreateBodyDto {
  text: string;
  postId: number;
}

export interface CommentListItemDto {
  id: number;
  text: string;
  date: Date;
  user: UserPublicDto;
}
