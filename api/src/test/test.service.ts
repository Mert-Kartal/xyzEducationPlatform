import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TestRepository } from './test.repository';
import { CreateTestDto, UpdateTestDto } from '../dto';
import { UserService } from '../user';
import { QuestionService } from '../question';
import { Field, Test } from '@prisma/client';
@Injectable()
export class TestService {
  constructor(
    private readonly testRepository: TestRepository,
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
  ) {}
  private async checkById(id: string) {
    const test = await this.testRepository.find(id);
    if (!test || test.deletedAt) {
      throw new NotFoundException('Test not found');
    }
    return test;
  }

  private checkAuthor(test: Test, userId: string) {
    if (test.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this test');
    }
  }

  private checkLength(tests: Test[]) {
    if (tests.length === 0) {
      throw new NotFoundException('no tests found');
    }
    return tests;
  }

  async checkQuestion(testId: string, questionId: string) {
    await this.checkById(testId);
    await this.questionService.show(questionId);
    const testQuestion = await this.testRepository.findQuestion(
      testId,
      questionId,
    );
    return testQuestion ? testQuestion : null;
  }

  async add(userId: string, createTestDto: CreateTestDto) {
    const user = await this.userService.show(userId);
    const test = await this.testRepository.create(
      userId,
      user.field,
      createTestDto,
    );
    return test;
  }

  async list() {
    const tests = await this.testRepository.index();
    return this.checkLength(tests);
  }

  async show(id: string) {
    return this.checkById(id);
  }

  async searchByAuthor(authorId: string) {
    const tests = await this.testRepository.searchByAuthor(authorId);
    return this.checkLength(tests);
  }

  async searchByField(field: Field) {
    const tests = await this.testRepository.searchByField(field);
    return this.checkLength(tests);
  }

  async update(id: string, authorId: string, data: UpdateTestDto) {
    if (Object.values(data).every((value) => value === undefined)) {
      throw new BadRequestException('No data to update');
    }
    const test = await this.checkById(id);
    this.checkAuthor(test, authorId);
    return this.testRepository.update(id, data);
  }

  async delete(id: string, authorId?: string) {
    const test = await this.checkById(id);
    if (authorId) {
      this.checkAuthor(test, authorId);
    }
    await this.testRepository.delete(id);
    return { message: 'Test deleted successfully' };
  }

  async addQuestion(testId: string, questionId: string) {
    const testQuestion = await this.checkQuestion(testId, questionId);
    if (testQuestion) {
      throw new BadRequestException('Question already in test');
    }
    return this.testRepository.addQuestion(testId, questionId);
  }

  async removeQuestion(testId: string, questionId: string) {
    const testQuestion = await this.checkQuestion(testId, questionId);
    if (!testQuestion) {
      throw new NotFoundException('Question not found in test');
    }
    return this.testRepository.removeQuestion(testId, questionId);
  }
}
