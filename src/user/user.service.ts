import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Stripe } from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from 'src/post/post.interface';
import { getUserDto, paymentInfoDto } from './dto';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private stripe;
  constructor(
    config: ConfigService,
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('User') private readonly userModel: Model<User>,
  ) {
    this.stripe = new Stripe(config.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-08-01',
    });
  }

  async getUser(id: string): Promise<getUserDto> {
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
      console.log(error);
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

  async payment(id: string, dto: paymentInfoDto) {
    try {
      const StripeToken = await this.stripe.tokens.create({
        card: {
          number: dto.number,
          exp_month: dto.exp_month,
          exp_year: dto.exp_year,
          cvc: dto.cvc,
        },
      });
      const user = await this.userModel.findById(id);
      const customer = await this.stripe.customers.create({
        source: StripeToken.id,
        name: user.fullname,
        id: user._id,
        address: {
          line1: 'temp',
          postal_code: '0000',
          city: 'temp',
          state: 'temp',
          country: 'temp',
        },
      });
      const charges = await this.stripe.charges.create({
        amount: 2000,
        description: 'Premium Membership Subscription',
        currency: 'USD',
        customer: customer.id,
      });
      user.isPaid = true;
      await user.save();

      return {
        message: 'Succesfully Subscribed',
        charges: charges,
      };
    } catch (error) {
      throw error;
    }
  }
}
