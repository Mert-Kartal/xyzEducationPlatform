import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { UserService } from '../user';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';
import { Field, Question } from '@prisma/client';
@Injectable()
export class QuestionService {
  constructor(
    private readonly questionRepository: QuestionRepository,
    private readonly userService: UserService,
  ) {}
  private async checkById(id: string) {
    const question = await this.questionRepository.find(id);
    if (!question || question.deletedAt) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }
  private checkLength(questions: Question[]) {
    if (questions.length !== 4) {
      throw new BadRequestException('no questions found');
    }
    return questions;
  }

  async add(id: string, data: CreateQuestionDto) {
    const user = await this.userService.show(id);
    return this.questionRepository.create(id, user.field, data);
  }

  async list() {
    const questions = await this.questionRepository.index();
    this.checkLength(questions);
  }

  async show(id: string) {
    return this.checkById(id);
  }

  async search(field: Field) {
    const questions = await this.questionRepository.search(field);
    this.checkLength(questions);
  }

  async searchByAuthor(authorId: string) {
    const questions = await this.questionRepository.searchByAuthor(authorId);
    this.checkLength(questions);
  }

  async edit(userId: string, id: string, data: UpdateQuestionDto) {
    const question = await this.checkById(id);
    await this.userService.show(userId);
    if (question.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this question');
    }
    return this.questionRepository.update(id, data);
  }

  async remove(id: string, userId?: string) {
    const question = await this.checkById(id);
    if (userId) {
      await this.userService.show(userId);
      if (question.authorId !== userId) {
        throw new ForbiddenException('You are not the author of this question');
      }
    }
    await this.questionRepository.delete(id);
    return { message: 'Question deleted successfully' };
  }
}
