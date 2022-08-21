import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.interface';
import { createPostDto, deletePostDto, updatePostDto } from './dto';
import { Post } from './post.interface';

@Injectable()
export class PostService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}
  async createPost(id: string, dto: createPostDto) {
    try {
      const user = await this.userModel.findById(id);

      const newpost = new this.postModel({
        createrId: id,
        createrName: user.fullname,
        desc: dto.desc,
      });
      await newpost.save();
      user.posts.push(newpost._id.toString());
      await user.save();
      return {
        success: true,
        message: 'Post created succesfully',
        post: newpost,
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePost(id: string, dto: updatePostDto) {
    try {
      const user = await this.userModel.findById(id);
      if (!user.posts.includes(dto.postId))
        throw new UnauthorizedException('You can only update your own post.');

      const post = await this.postModel.findById(dto.postId);
      post.desc = dto.desc;
      await post.save();

      return {
        success: true,
        message: 'Post updated Successfully',
        post: {
          post,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllPost(id: string) {
    try {
      const post = await this.postModel.find({ createrId: id });
      return {
        success: true,
        post: post,
      };
    } catch (error) {
      throw error;
    }
  }

  async deletePost(id: string, dto: deletePostDto) {
    try {
      if (!(await this.postModel.findById(dto.postId)))
        throw new NotFoundException('Post not found');
      const post = await this.postModel.findById(dto.postId);
      const user = await this.userModel.findById(id);
      if (!user.posts.includes(post._id.toString()))
        throw new UnauthorizedException('You can only delete your own post');
      await user.updateOne({ $pull: { posts: dto.postId } });
      await user.save();
      await post.delete();
      return {
        success: true,
        message: 'Post Deleted Successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
