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
import { RequireJwtRoles } from '../roles/roles.decorator';
import { Role } from '../roles/roles';

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

  @RequireJwtRoles(Role.Admin)
  @Post()
  async create(@Body() data: TagCreateDto) {
    return await this.tagService.create(data);
  }

  @RequireJwtRoles(Role.Admin)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: Partial<TagCreateDto>) {
    return await this.tagService.update(Number(id), data);
  }

  @RequireJwtRoles(Role.Admin)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.tagService.delete(Number(id));
  }
}
