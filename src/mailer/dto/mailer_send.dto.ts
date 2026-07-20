import { IsOptional, IsString } from 'class-validator';

export class MailerDto {
  @IsString()
  @IsOptional()
  to?: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;
}
