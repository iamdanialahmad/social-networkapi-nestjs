import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async followUser(id: string, followUserId: string) {
    try {
      const followUser = await this.userModel.findById(followUserId);
      if (!followUser) throw new NotFoundException('User not found');

      const user = await this.userModel.findById(id);

      if (user.following.includes(followUserId))
        throw new BadRequestException('User already followed');

      user.following.push(followUserId);

      await user.save();

      followUser.followers.push(id);

      await followUser.save();

      return {
        success: true,
        msg: 'User followed successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  async unfollowUser(id: string, unfollowUserId: string) {
    try {
      const unfollowUser = await this.userModel.findById(unfollowUserId);
      if (!unfollowUser) throw new NotFoundException('User not found');

      const user = await this.userModel.findById(id);

      if (!user.following.includes(unfollowUserId))
        throw new BadRequestException('User not followed');
      await user.updateOne({ $pull: { following: unfollowUserId } });
      await unfollowUser.updateOne({ $pull: { followers: id } });
      return {
        success: true,
        msg: 'User unfollowed successfully',
      };
    } catch (error) {
      throw error;
    }
  }
}
