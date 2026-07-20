import { IsArray, IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class UpdateSubscriptDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsBoolean()
  subscribed: boolean;

  @IsOptional()
  @IsArray()
  array_subscripts: string[];
}
