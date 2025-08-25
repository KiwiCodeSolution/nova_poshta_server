import { PartialType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { CreatePpoDto } from './create-ppo.dto';

export class UpdatePpoDto extends PartialType(CreatePpoDto) {
  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  regionId?: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsString()
  director?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  admission_address?: string;

  @IsOptional()
  @IsString()
  application_address?: string;

  @IsOptional()
  @IsArray()
  committee?: string[];

  @IsOptional()
  @IsString()
  link_news?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  is_active?: boolean;
}
