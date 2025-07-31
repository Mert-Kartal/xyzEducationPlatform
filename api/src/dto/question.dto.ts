import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  content: string;
}

export class UpdateQuestionDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  content: string;
}
