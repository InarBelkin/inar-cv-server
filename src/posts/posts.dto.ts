export class PostListItemDto {
  id: number;
  title: string;
  contentPreview: string;
  date: Date;
  tags: { id: number; name: string }[];
}

export class PostListDto {
  data: PostListItemDto[];
  pageCount: number | null;
}

export class PostListFilter {
  page: number | undefined;
  limit: number | undefined;
  tagId: number | undefined;
}

export class OnePostDto {
  id: number;
  title: string;
  date: Date;
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
