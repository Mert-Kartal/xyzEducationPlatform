import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { UserService } from '../user';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';
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

  async add(id: string, data: CreateQuestionDto) {
    const user = await this.userService.show(id);
    return this.questionRepository.create(id, user.field, data);
  }

  async list() {
    return this.questionRepository.index();
  }

  async show(id: string) {
    return this.checkById(id);
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
