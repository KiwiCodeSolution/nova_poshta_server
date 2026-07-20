import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly phone: string;
}
