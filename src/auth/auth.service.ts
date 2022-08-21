import { ForbiddenException, Injectable } from '@nestjs/common';
import { signinDto, signupDto } from './dto';
import * as argon from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(dto: signupDto) {
    try {
      // generate password hash
      const hash = await argon.hash(dto.password);

      // save the new user in the db
      const newUser = new this.userModel({
        username: dto.username,
        email: dto.email,
        password: hash,
        fullname: dto.fullname,
      });

      // return the saved user
      const result = await newUser.save();
      return this.signToken(result.id, result.email);
    } catch (error) {
      if (error.code === 11000) {
        throw new ForbiddenException('Credentials Taken');
      }
      throw error;
    }
  }
  async signin(dto: signinDto) {
    try {
      // find user by email
      const user = await await this.userModel.findOne({ email: dto.email });
      // if user does not exist throw exception
      if (!user) throw new ForbiddenException('Credentials Incorrect');
      //compare password
      const compare = await argon.verify(user.password, dto.password);
      //if password incorrect throw exception
      if (!compare) throw new ForbiddenException('Credentials Incorrect');
      //send the user back
      return this.signToken(user.id, user.email);
    } catch (error) {
      throw error;
    }
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: secret,
    });
    return {
      access_token: token,
    };
  }
}
