import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { CreateOptionDto, UpdateOptionDto } from '../../dto';

@Injectable()
export class OptionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(questionId: string, option: CreateOptionDto) {
    return this.prisma.option.create({
      data: {
        ...option,
        questionId,
      },
    });
  }

  async index(questionId: string) {
    return this.prisma.option.findMany({
      where: {
        questionId,
      },
    });
  }

  async show(questionId: string, optionId: string) {
    return this.prisma.option.findUnique({
      where: {
        id: optionId,
        questionId,
      },
    });
  }

  async search(questionId: string, optionText: string) {
    return this.prisma.option.findFirst({
      where: {
        questionId,
        optionText,
      },
    });
  }

  async update(questionId: string, optionId: string, data: UpdateOptionDto) {
    return this.prisma.option.update({
      where: {
        id: optionId,
        questionId,
      },
      data,
    });
  }

  async delete(questionId: string, optionId: string) {
    return this.prisma.option.delete({
      where: {
        id: optionId,
        questionId,
      },
    });
  }

  async correctTransaction(
    questionId: string,
    oldOptionId: string,
    newOptionId: string,
  ) {
    return this.prisma.$transaction(async (tx) => {
      await tx.option.update({
        where: {
          id: oldOptionId,
          questionId,
        },
        data: {
          isCorrect: false,
        },
      });
      await tx.option.update({
        where: {
          id: newOptionId,
          questionId,
        },
        data: {
          isCorrect: true,
        },
      });
    });
  }
}
