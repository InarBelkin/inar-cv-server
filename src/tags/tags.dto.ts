import { Post } from '../posts/post';

export class TagGetDto {
  id: number;
  name: string;
  posts: Post[];
}

export class TagCreateDto {
  name: string;
}
