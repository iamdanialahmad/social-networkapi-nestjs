import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class paymentInfoDto {
  @IsNotEmpty()
  @IsNumber()
  number: number;

  @IsNotEmpty()
  @IsString()
  exp_month: string;

  @IsNotEmpty()
  @IsString()
  exp_year: string;

  @IsNotEmpty()
  @IsNumber()
  cvc: string[];
}
