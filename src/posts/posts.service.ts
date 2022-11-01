import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OnePostDto,
  PostCreateDto,
  PostListDto,
  PostListFilter,
  PostListItemDto,
  PostUpdateDto,
} from './posts.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Brackets, DeepPartial, Repository } from 'typeorm';
import { InsertionDto } from '../additional/dto/insertion.dto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class PostsService {
  public constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private commentsService: CommentsService,
  ) {}

  public async getAll2(filter: PostListFilter) {
    let query = this.postRepository.createQueryBuilder('post');
    if (filter.notPublished) {
      query = query.where(
        '(post.publicationDate IS NULL OR post.publicationDate > :currentDate)',
        { currentDate: new Date().toISOString() },
      );
    } else {
      query = query.where(
        new Brackets((br) =>
          br
            .where('post.publicationDate IS NOT NULL')
            .andWhere('post.publicationDate <= :currentDate', {
              currentDate: new Date().toISOString(),
            }),
        ),
      );
    }

    query = query.select([
      'post.id',
      'post.title',
      'post.contentPreview',
      'post.creationDate',
      'post.publicationDate',
    ]);

    if (filter.tagName) {
      query = query
        .leftJoinAndSelect('post.tags', 'inner_tag')
        .andWhere('inner_tag.name IN (:tName)', { tName: filter.tagName });
    }
    query = query
      .leftJoinAndSelect('post.tags', 'tag')
      .orderBy(
        !filter.notPublished ? 'post.publicationDate' : 'post.creationDate',
        'DESC',
      );

    if (filter.limit && filter.page) {
      query = query.skip((filter.page - 1) * filter.limit).take(filter.limit);
    }

    const [posts, totalCount] = await query.getManyAndCount();
    const pageCount = Math.ceil(totalCount / filter.limit);
    return {
      data: posts as PostListItemDto[],
      pageCount: pageCount,
    } as PostListDto;
  }

  public async getOne(id: number) {
    const post = (
      await this.postRepository.find({
        where: { id: id },
        relations: { tags: true },
      })
    )[0];
    if (!post) throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    const result = post as OnePostDto;
    result.comments = await this.commentsService.getByPost(post.id);
    return result;
  }

  public async create(data: PostCreateDto) {
    const post = {
      creationDate: new Date(),
      publicationDate: data.publicationDate,
      content: data.content,
      tags: data.tags,
      contentPreview: data.contentPreview,
      title: data.title,
    } as Post;
    const createdPost = await this.postRepository.save(post);
    return {
      inserted: createdPost,
      success: true,
      message: 'post successfully created',
    } as InsertionDto;
  }

  public async update(id: number, data: DeepPartial<PostUpdateDto>) {
    data.id = id;
    const post = await this.postRepository.preload(data);
    if (!post) throw new NotFoundException("This post doesn't exists");
    const inserted = await this.postRepository.save(post);
    return {
      inserted,
      success: true,
      message: 'post successfully updated',
    } as InsertionDto;
  }

  public async delete(id: number) {
    await this.postRepository.delete({ id: id });
    return {
      success: true,
      message: 'Post successfully deleted',
    } as InsertionDto;
  }
}
