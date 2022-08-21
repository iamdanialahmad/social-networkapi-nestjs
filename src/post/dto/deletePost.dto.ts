import { IsNotEmpty, IsString } from 'class-validator';

export class deletePostDto {
  @IsNotEmpty()
  @IsString()
  postId: string;
}
