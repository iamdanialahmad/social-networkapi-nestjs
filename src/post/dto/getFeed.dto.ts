import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class getFeedDto {
  @IsString()
  param: string;

  @IsNumber()
  order: number;

  @IsNumber()
  page: number;

  @IsNotEmpty()
  limit: number;
}
