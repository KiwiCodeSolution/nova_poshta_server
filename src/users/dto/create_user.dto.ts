import {
  IsEmail,
  IsInt,
  IsNumber,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly username: string;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly phone: string;

  @IsString()
  password: string;
}
