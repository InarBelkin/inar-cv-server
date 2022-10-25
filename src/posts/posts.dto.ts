export interface PostListItemDto {
  id: number;
  title: string;
  creationDate: Date;
  publicationDate: Date;
  contentPreview: string;
  tags: { id: number; name: string }[];
}

export interface PostListDto {
  data: PostListItemDto[];
  pageCount: number | null;
}

export class PostListFilter {
  page: number | undefined;
  limit: number | undefined;
  tagName: string | undefined;
}

export interface OnePostDto {
  id: number;
  title: string;
  creationDate: Date;
  publicationDate: Date | null;
  contentPreview: string;
  content: string;
  tags: { id: number; name: string }[];
}

export interface PostCreateDto {
  title: string;
  contentPreview: string;
  content: string;
  publicationDate: Date | null;
  tags: { id: number }[];
}

export interface PostUpdateDto {
  id: number;
  title: string;
  publicationDate: Date | null;
  contentPreview: string;
  content: string;
  tags: { id: number }[];
}
