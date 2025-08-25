import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  sections?: string[];

  @IsOptional()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  previewText: string;

  @IsOptional()
  @IsArray()
  metaTags?: string[];

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsEnum(['published', 'created', 'archived'], {
    message: 'Status must be either published, created, or archived',
  })
  status?: 'published' | 'created' | 'archived';

  @IsOptional()
  publishDate?: Date;

  @IsOptional()
  @IsString()
  author: string;

  @IsOptional()
  readonly images: [
    {
      filename: String;
      url: String;
    },
  ];
}
