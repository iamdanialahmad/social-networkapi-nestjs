import { IsArray, IsString } from 'class-validator';

export class getUserDto {
  @IsString()
  username: string;

  @IsString()
  fullname: string;

  @IsString()
  email: string;

  @IsArray()
  followers: string[];

  @IsArray()
  following: string[];

  @IsArray()
  posts: string[];

  isModerator: boolean;

  isPaid: boolean;

  createdAt: Date;
}
