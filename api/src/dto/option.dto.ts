import { OptionLabel } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';

export class CreateOptionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  optionText: string;

  @IsNotEmpty()
  @IsEnum(OptionLabel)
  optionType: OptionLabel;

  @IsNotEmpty()
  @IsBoolean()
  isCorrect: boolean;
}

export class UpdateOptionDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  optionText: string;

  @IsOptional()
  @IsEnum(OptionLabel)
  optionType: OptionLabel;

  @IsOptional()
  @IsBoolean()
  isCorrect: boolean;
}
