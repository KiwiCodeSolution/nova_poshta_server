import { Transform } from 'class-transformer';
import { IsBoolean, IsString, IsUrl } from 'class-validator';

export class CreateDefenderDto {
  @IsString() titleUk: string;
  @IsString() titleEn: string;
  @IsString() descriptionUk: string;
  @IsString() descriptionEn: string;
  @IsString() goalUk: string;
  @IsString() goalEn: string;
  @IsUrl() link: string;
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  is_active: boolean;
}
