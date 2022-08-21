import { IsNotEmpty, IsString } from 'class-validator';

export class followUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
