import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommentEntity } from './comments.entity';
import { Repository } from 'typeorm';
import { CommentCreateBodyDto, CommentListItemDto } from './comments.dto';
import { InsertionDto } from '../additional/dto/insertion.dto';
import { UserDto } from '../users/users.dto';
import { Role } from '../roles/roles';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  async create(
    dto: CommentCreateBodyDto,
    user: UserDto,
  ): Promise<InsertionDto> {
    const comment = {
      id: null,
      text: dto.text,
      date: new Date(),
      user: { id: user.id, username: user.username },
      post: { id: dto.postId },
    } as CommentEntity;
    const createdComment = await this.commentRepository.save(comment);
    return {
      inserted: createdComment,
      success: true,
      message: 'Comment created successfully',
    };
  }

  async getByPost(postId: number): Promise<CommentListItemDto[]> {
    const comments = (await this.commentRepository.find({
      where: { post: { id: postId } },
      relations: { user: true },
      select: {
        id: true,
        text: true,
        date: true,
        user: { id: true, username: true },
      },
    })) as CommentListItemDto[];
    return comments;
  }

  async deleteAdmin(id: number, user: UserDto): Promise<InsertionDto> {
    const deleteFun = async () => {
      await this.commentRepository.delete({ id: id });
      return {
        success: true,
        message: 'successfully deleted',
      };
    };
    if (user.roles.includes(Role.Admin)) {
      return await deleteFun();
    } else {
      const comment = (
        await this.commentRepository.find({
          where: { id },
          relations: { user: true },
        })
      )[0];
      if (comment.user.id !== user.id) throw new ForbiddenException();
      return await deleteFun();
    }
  }
}
