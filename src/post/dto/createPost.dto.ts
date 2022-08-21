import { IsNotEmpty, IsString } from 'class-validator';

export class createPostDto {
  @IsNotEmpty()
  @IsString()
  desc: string;
}
