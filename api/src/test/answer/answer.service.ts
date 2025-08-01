import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AnswerRepository } from './answer.repository';
import { AnswerItemDto, SubmitAnswersDto } from '../../dto';
import { OptionService } from '../../question/option';
import { TestService } from '../test.service';
import { OptionLabel } from '@prisma/client';
import { QuestionService } from '../../question';
import { UserService } from '../../user';
@Injectable()
export class AnswerService {
  constructor(
    private readonly answerRepository: AnswerRepository,
    private readonly optionService: OptionService,
    private readonly testService: TestService,
    private readonly questionService: QuestionService,
    private readonly userService: UserService,
  ) {}

  private async addAnswer(
    userId: string,
    testId: string,
    answer: AnswerItemDto,
    optionType: OptionLabel = OptionLabel.NONE,
    isCorrect: boolean = false,
  ) {
    return this.answerRepository.create(
      userId,
      testId,
      answer,
      optionType,
      isCorrect,
    );
  }

  async add(userId: string, testId: string, data: SubmitAnswersDto) {
    await this.testService.show(testId);
    const answers = await this.answerRepository.findUserAnswers(testId, userId);

    if (answers.length > 0) {
      throw new BadRequestException('You have already answered this test');
    }

    const repeatedQuestions = data.answers.some((answer, index) =>
      data.answers.some(
        (otherAnswer, otherIndex) =>
          answer.questionId === otherAnswer.questionId && index !== otherIndex,
      ),
    );

    if (repeatedQuestions) {
      throw new BadRequestException('QuestionId cannot be repeated');
    }

    for (const answer of data.answers) {
      await this.questionService.show(answer.questionId);

      let optionTypeToSave: OptionLabel = OptionLabel.NONE;
      let isCorrectToSave: boolean = false;

      if (answer.optionId) {
        const option = await this.optionService.show(
          answer.questionId,
          answer.optionId,
        );

        optionTypeToSave = option.optionType;
        isCorrectToSave = option.isCorrect;
      }
      await this.addAnswer(
        userId,
        testId,
        answer,
        optionTypeToSave,
        isCorrectToSave,
      );
    }

    return {
      message: 'Answers added successfully',
    };
  }

  async show(userId: string, testId: string) {
    await this.testService.show(testId);
    const answers = await this.answerRepository.findUserAnswers(testId, userId);
    if (answers.length === 0) {
      throw new NotFoundException(
        'No answers found for this user in this test',
      );
    }
    return answers;
  }

  async findByTestId(testId: string) {
    await this.testService.show(testId);
    const answers = await this.answerRepository.findByTestId(testId);
    if (answers.length === 0) {
      throw new NotFoundException('No answers found for this test');
    }
    return answers;
  }

  async findByUserId(userId: string) {
    await this.userService.show(userId);
    const answers = await this.answerRepository.findByUserId(userId);
    if (answers.length === 0) {
      throw new NotFoundException('No answers found for this user');
    }
    return answers;
  }
}
