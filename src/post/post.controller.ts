import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { getUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { createPostDto, updatePostDto, deletePostDto } from './dto';
import { PostService } from './post.service';

@UseGuards(JwtGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('createPost')
  createPost(@getUser('id') id: string, @Body() dto: createPostDto) {
    return this.postService.createPost(id, dto);
  }

  @Post('updatePost')
  updatePost(@getUser('id') id: string, @Body() dto: updatePostDto) {
    return this.postService.updatePost(id, dto);
  }

  @Get('getAllPost')
  getAllPost(@getUser('id') id: string) {
    return this.postService.getAllPost(id);
  }

  @Delete('deletePost')
  deletePost(@getUser('id') id: string, @Body() dto: deletePostDto) {
    return this.postService.deletePost(id, dto);
  }
}
