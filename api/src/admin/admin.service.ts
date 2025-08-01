import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateAdminDto } from '../dto';
import { UserService } from '../user';
import * as bcrypt from 'bcrypt';
import { OptionService, QuestionService } from '../question';
import { TestService } from '../test';
import { AnswerService } from '../test/answer';
@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly questionService: QuestionService,
    private readonly optionService: OptionService,
    private readonly testService: TestService,
    private readonly answerService: AnswerService,
  ) {}

  // User
  async createUser(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userService.add({
      ...data,
      password: hashedPassword,
    } as CreateUserDto);
    return user;
  }

  async listUsers() {
    return this.userService.list();
  }

  async showUser(id: string) {
    return this.userService.show(id);
  }

  async updateUser(id: string, data: UpdateAdminDto) {
    return this.userService.update(id, data);
  }

  async deleteUser(id: string) {
    return this.userService.delete(id);
  }

  // Question
  async deleteQuestion(id: string) {
    return this.questionService.remove(id);
  }

  // Options
  async deleteOption(id: string, optionId: string) {
    return this.optionService.remove(id, optionId);
  }

  // Test
  async deleteTest(id: string) {
    return this.testService.delete(id);
  }

  // Answer
  async showAnswer(userId: string, testId: string) {
    return this.answerService.show(userId, testId);
  }

  async showAllAnswers(testId: string) {
    return this.answerService.findByTestId(testId);
  }

  async showAllAnswersByUserId(userId: string) {
    return this.answerService.findByUserId(userId);
  }
}
