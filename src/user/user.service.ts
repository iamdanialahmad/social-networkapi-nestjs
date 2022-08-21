import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/post.interface';
import { User } from './user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {}

  async getUser(id: string) {
    try {
      const user = await this.userModel.findOne({ _id: id });

      return {
        username: user.username,
        email: user.email,
        fullname: user.fullname,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        isModerator: user.isModerator,
        isPaid: user.isPaid,
        createdAt: user.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.userModel.findById(id);
      await this.postModel.deleteMany({ createrId: id });
      await user.delete();
      return {
        success: true,
        message: 'User deleted Successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
