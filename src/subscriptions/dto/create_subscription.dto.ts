import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  subscribed: boolean;

  @IsEmail()
  email: string;
}
