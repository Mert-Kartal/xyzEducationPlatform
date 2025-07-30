import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateQuestionDto {
  @IsNotEmpty()
  @IsString()
  content: string;
}
