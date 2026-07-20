import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ImageDto {
  @IsString()
  filename: string;

  @IsString()
  url: string;
}

export class CreateNewsDto {
  @IsString()
  readonly title: string;

  @IsOptional()
  @IsArray()
  readonly sections: string[];

  @IsOptional()
  @IsString()
  readonly author?: string;

  @IsOptional()
  @IsArray()
  readonly metaTags?: string[];

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  previewText: string;

  @IsOptional()
  @IsString()
  previewImage: string;

  @IsOptional()
  @IsEnum(['published', 'created', 'archived'])
  readonly status: 'published' | 'created' | 'archived';

  @IsOptional()
  @IsString()
  readonly publishDate?: Date;

  @IsOptional()
  @IsDateString()
  readonly datetime?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: string[];
}
