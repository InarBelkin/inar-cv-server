import { Post } from '../posts/post.entity';

export class TagGetDto {
  id: number;
  name: string;
}

export class TagCreateDto {
  name: string;
}
