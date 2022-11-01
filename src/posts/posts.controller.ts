import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostCreateDto, PostListFilter } from './posts.dto';
import { RequireJwtRoles } from '../roles/roles.decorator';
import { Role } from '../roles/roles';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Get()
  public async getAll(@Query() query: PostListFilter) {
    return await this.postsService.getAll2(query);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.postsService.getOne(Number(id));
  }

  @RequireJwtRoles(Role.Admin)
  @Post()
  async create(@Body() data: PostCreateDto) {
    return await this.postsService.create(data);
  }

  @RequireJwtRoles(Role.Admin)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: Partial<PostCreateDto>) {
    return await this.postsService.update(Number(id), data);
  }

  @RequireJwtRoles(Role.Admin)
  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.postsService.delete(Number(id));
  }
}
