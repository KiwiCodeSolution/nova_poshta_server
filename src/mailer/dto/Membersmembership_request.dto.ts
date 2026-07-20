import { IsEmail, IsOptional, IsString } from 'class-validator';

export class MembershipRequestDto {
  @IsOptional()
  @IsString()
  region: string;

  @IsOptional()
  @IsString()
  phone: string;
}
