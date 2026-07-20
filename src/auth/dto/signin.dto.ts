import { IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  readonly username: string;

  @IsString()
  password: string;
}
