import { IsString } from 'class-validator';

export class MailerDto {
  @IsString()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  text: string;

  @IsString()
  html: string;
}
