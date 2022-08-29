import { IsNotEmpty, IsString } from 'class-validator';

export class updatePostDto {
  @IsNotEmpty()
  @IsString()
  postId: string;

  @IsString()
  desc: string;
}
