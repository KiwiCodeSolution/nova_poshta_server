import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreatePpoDto {
  @IsString()
  readonly region: string;

  @IsString()
  readonly region_name: string;

  @IsNumber()
  readonly quantity: number;

  @IsString()
  readonly image: string;

  @IsString()
  readonly director: string;

  @IsString()
  readonly position: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phone: string;

  @IsString()
  readonly avatar: string;

  @IsString()
  readonly admission_address: string;

  @IsString()
  readonly application_address: string;

  readonly committee: string[];

  @IsString()
  readonly link_news: string;

  @IsString()
  readonly link: string;
}
