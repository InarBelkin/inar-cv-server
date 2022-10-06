import { Injectable } from '@nestjs/common';
import {
  OnePostDto,
  PostCreateDto,
  PostListFilter,
  PostUpdateDto,
} from './posts.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class PostsService {
  public constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  public async getAll(filter: PostListFilter) {
    //TODO: add date in post
    let query = this.postRepository.createQueryBuilder('post');
    if (filter.tagId) {
      query = query
        .innerJoin('post.tags', 'inner-tag')
        .where('inner-tag.id IN (:tId)', { tId: filter.tagId })
        .leftJoinAndSelect('post.tags', 'tag');
    }
    if (filter.limit && filter.page) {
      query = query.skip((filter.page - 1) * filter.limit).take(filter.limit);
    }
    const [posts, totalCount] = await query.getManyAndCount();

    const pageCount = Math.ceil(totalCount / filter.limit);
    return {
      data: posts,
      pageCount: pageCount,
    };
  }

  public async getOne(id: number) {
    const post = (await this.postRepository.find({ where: { id: id } }))[0];
    return post as OnePostDto;
  }

  public async create(data: PostCreateDto) {
    const createdPost = await this.postRepository.save(data);
    return { inserted: createdPost };
  }

  public async update(id: number, data: DeepPartial<PostUpdateDto>) {
    data.id = id;
    const post = await this.postRepository.preload(data);
    return await this.postRepository.save(post);
  }

  public async delete(id: number) {
    return await this.postRepository.delete({ id: id });
  }
}
