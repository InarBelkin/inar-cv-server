import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentCreateBodyDto } from './comments.dto';
import { RequireJwtRoles } from '../roles/roles.decorator';
import { Role } from '../roles/roles';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';

@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @RequireJwtRoles(Role.User)
  @Post()
  public async create(@Body() data: CommentCreateBodyDto, @Req() req) {
    return this.commentService.create(data, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  public async delete(@Param('id') id, @Req() req) {
    return this.commentService.deleteAdmin(id, req.user);
  }
}
