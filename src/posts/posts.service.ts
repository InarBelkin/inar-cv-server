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
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  public constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  public async getAll(filter: PostListFilter) {
    //TODO: add date in post
    let query = this.postRepository.createQueryBuilder('post');
    query = query.select([
      'post.id',
      'post.title',
      'post.contentPreview',
      'post.date',
    ]);
    if (filter.tagId) {
      query = query
        .innerJoin('post.tags', 'inner-tag')
        .where('inner-tag.id IN (:tId)', { tId: filter.tagId });
    }
    query = query.leftJoinAndSelect('post.tags', 'tag');
    query = query.orderBy('post.date', 'DESC');
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
      await this.postRepository.find({ where: { id: id }, relations: ['tags'] })
    )[0];
    if (!post) throw new HttpException('post not found', HttpStatus.NOT_FOUND);
    return post as OnePostDto;
  }

  public async create(data: PostCreateDto) {
    const post = {
      date: new Date(),
      content: data.content,
      tags: data.tags,
      contentPreview: data.contentPreview,
      title: data.title,
    };
    const createdPost = await this.postRepository.save(post);
    return { inserted: createdPost };
  }

  public async update(id: number, data: DeepPartial<PostUpdateDto>) {
    data.id = id;
    const post = await this.postRepository.preload(data);
    if (!post) throw new NotFoundException("This post doesn't exists");
    return await this.postRepository.save(post);
  }

  public async delete(id: number) {
    return await this.postRepository.delete({ id: id });
  }
}
