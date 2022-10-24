import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tags.entity';
import { TagCreateDto, TagGetDto } from './tags.dto';

@Injectable()
export class TagsService {
  constructor(@InjectRepository(Tag) private tagRepos: Repository<Tag>) {}

  async getAll() {
    const tags = await this.tagRepos.find();
    return tags as TagGetDto[];
  }

  async getOne(id: number) {
    const tag = (await this.tagRepos.find({ where: { id: id } }))[0];
    if (!tag) throw new NotFoundException("This tag doesn't exist");
    return tag as TagGetDto;
  }

  async create(data: TagCreateDto) {
    const createdTag = await this.tagRepos.save({ name: data.name });
    return { inserted: createdTag };
  }

  async update(id: number, data: Partial<TagCreateDto>) {
    return await this.tagRepos.update({ id: id }, { name: data.name });
  }

  async delete(id: number) {
    return await this.tagRepos.delete({ id: id });
  }
}
