import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OptionRepository } from './option.repository';
import { QuestionService } from '../question.service';
import { CreateOptionDto, UpdateOptionDto } from '../../dto';
import { Option, OptionLabel, Question } from '@prisma/client';

type QuestionWithOptions = Question & { options: Option[] };

@Injectable()
export class OptionService {
  constructor(
    private readonly optionRepository: OptionRepository,
    private readonly questionService: QuestionService,
  ) {}

  async show(questionId: string, optionId: string) {
    const option = await this.optionRepository.show(questionId, optionId);
    if (!option) {
      throw new NotFoundException('Option not found');
    }
    return option;
  }

  private async checkOptionText(questionId: string, optionText: string) {
    const existOptionText = await this.optionRepository.search(
      questionId,
      optionText,
    );

    if (existOptionText) {
      throw new BadRequestException('Option text already exists');
    }
  }

  private checkOptionType(
    question: QuestionWithOptions,
    optionType: OptionLabel,
  ) {
    if (optionType === OptionLabel.NONE) {
      throw new BadRequestException('Option type cannot be NONE');
    }
    const existOptionType = question.options.find(
      (option) => option.optionType === optionType,
    );
    if (existOptionType) {
      throw new BadRequestException('Option type already exists');
    }
  }

  private checkOptionCorrect(
    question: QuestionWithOptions,
    data: UpdateOptionDto,
  ) {
    const correctOption = question.options.find(
      (option) => option.isCorrect === true,
    );

    if (data.isCorrect === true) {
      if (correctOption) {
        return correctOption;
      }
    } else {
      if (question.options.length === 4) {
        throw new BadRequestException('Already has 3 wrong option');
      }
    }
  }

  private checkAuthor(question: Question, userId: string) {
    if (question.authorId !== userId) {
      throw new ForbiddenException('You are not the author of this question');
    }
  }

  async add(questionId: string, data: CreateOptionDto, userId: string) {
    const question = await this.questionService.show(questionId);

    this.checkAuthor(question, userId);

    if (question.options.length === 4) {
      throw new BadRequestException('Question already has 4 options');
    }

    const isCorrect = this.checkOptionCorrect(question, data);

    if (isCorrect) {
      await this.optionRepository.update(questionId, isCorrect.id, {
        isCorrect: false,
      } as UpdateOptionDto);
    }

    await this.checkOptionText(questionId, data.optionText);

    this.checkOptionType(question, data.optionType);

    return this.optionRepository.create(questionId, data);
  }

  updateOptionPlain = {
    optionText: async (
      optionText: string,
      question: QuestionWithOptions,
      optionId: string,
    ) => {
      await this.checkOptionText(question.id, optionText);
      await this.optionRepository.update(question.id, optionId, {
        optionText,
      } as UpdateOptionDto);
    },
    optionType: async (
      optionType: OptionLabel,
      question: QuestionWithOptions,
      optionId: string,
    ) => {
      this.checkOptionType(question, optionType);
      await this.optionRepository.update(question.id, optionId, {
        optionType,
      } as UpdateOptionDto);
    },
    isCorrect: async (
      isCorrect: boolean,
      question: QuestionWithOptions,
      optionId: string,
    ) => {
      const oldCorrectOption = this.checkOptionCorrect(question, {
        isCorrect,
      } as UpdateOptionDto);
      if (oldCorrectOption) {
        await this.optionRepository.correctTransaction(
          question.id,
          oldCorrectOption.id,
          optionId,
        );
      } else {
        await this.optionRepository.update(question.id, optionId, {
          isCorrect,
        } as UpdateOptionDto);
      }
    },
  };

  async edit(
    questionId: string,
    optionId: string,
    userId: string,
    data: UpdateOptionDto,
  ) {
    const question = await this.questionService.show(questionId);
    this.checkAuthor(question, userId);
    await this.show(questionId, optionId);

    if (Object.values(data).every((value) => value === undefined)) {
      throw new BadRequestException('No data provided');
    }

    const dataKeys = Object.keys(data);

    for (const key of dataKeys) {
      if (data[key] !== undefined && data[key] !== null) {
        await this.updateOptionPlain[key](data[key], question, optionId);
      }
    }

    return {
      message: 'Specified fields have been updated',
    };
  }

  async remove(questionId: string, optionId: string, userId?: string) {
    const question = await this.questionService.show(questionId);
    if (userId) {
      this.checkAuthor(question, userId);
    }
    await this.show(questionId, optionId);
    await this.optionRepository.delete(questionId, optionId);
    return {
      message: 'Option deleted successfully',
    };
  }
}
