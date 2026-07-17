import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class ContactFormDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(10)
  message: string;

  // honeypot: приховане поле, яке заповнюють лише боти
  @IsOptional()
  @IsString()
  website?: string;
}
