export class PostListDto {
  title: string;
  contentPreview: string;
  tags: { id: number; name: string }[];
}

export class PostListFilter {
  page: number | undefined;
  limit: number | undefined;
  tagId: number | undefined;
}

export class OnePostDto {
  title: string;
  contentPreview: string;
  content: string;
  tags: { id: number; name: string }[];
}

export class PostCreateDto {
  title: string;
  contentPreview: string;
  content: string;
  tags: { id: number }[];
}

export class PostUpdateDto {
  id: number;
  title: string;
  contentPreview: string;
  content: string;
  tags: { id: number }[];
}
