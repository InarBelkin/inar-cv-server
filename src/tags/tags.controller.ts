import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagCreateDto } from './tags.dto';

@Controller('tags')
export class TagsController {
  constructor(private tagService: TagsService) {}

  @Get()
  async getAll() {
    return await this.tagService.getAll();
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.tagService.getOne(Number(id));
  }

  @Post()
  async create(@Body() data: TagCreateDto) {
    return await this.tagService.create(data);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: Partial<TagCreateDto>) {
    return await this.tagService.update(Number(id), data);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.tagService.delete(Number(id));
  }
}
