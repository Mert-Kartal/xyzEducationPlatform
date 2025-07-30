import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';
import { Field } from '@prisma/client';

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(id: string, field: Field, data: CreateQuestionDto) {
    return await this.prisma.question.create({
      data: {
        ...data,
        field,
        authorId: id,
      },
    });
  }

  async index() {
    return this.prisma.question.findMany();
  }

  async find(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
    });
  }

  async update(id: string, data: UpdateQuestionDto) {
    return this.prisma.question.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.question.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
