import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class UpdateTestDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
