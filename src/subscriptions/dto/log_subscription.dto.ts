import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LogSubscriptionDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email: string;
}
