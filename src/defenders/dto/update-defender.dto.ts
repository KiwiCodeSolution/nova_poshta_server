import { PartialType } from '@nestjs/mapped-types';
import { CreateDefenderDto } from './create-defender.dto';

export class UpdateDefenderDto extends PartialType(CreateDefenderDto) {}
