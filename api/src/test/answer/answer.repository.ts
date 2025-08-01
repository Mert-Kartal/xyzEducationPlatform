import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { AnswerItemDto } from '../../dto';
import { OptionLabel } from '@prisma/client';

@Injectable()
export class AnswerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    testId: string,
    data: AnswerItemDto,
    answer: OptionLabel,
    isCorrect: boolean,
  ) {
    return this.prisma.answer.create({
      data: {
        userId,
        testId,
        questionId: data.questionId,
        optionId: data.optionId || '',
        answer,
        isCorrect,
      },
    });
  }

  async findUserAnswers(testId: string, userId: string) {
    return this.prisma.answer.findMany({
      where: {
        testId,
        userId,
      },
      select: {
        Question: {
          select: {
            content: true,
          },
        },
        Option: {
          select: {
            optionText: true,
          },
        },
        answer: true,
        isCorrect: true,
      },
    });
  }

  async findByTestId(testId: string) {
    return this.prisma.answer.findMany({
      where: {
        testId,
      },
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByUserId(userId: string) {
    return await this.prisma.answer.findMany({
      where: {
        userId,
      },
      select: {
        Test: {
          select: {
            title: true,
          },
        },
        Question: {
          select: {
            content: true,
          },
        },
        isCorrect: true,
      },
    });
  }
}
