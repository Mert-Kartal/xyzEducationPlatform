import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { CreateTestDto, UpdateTestDto } from '../dto';
import { Field } from '@prisma/client';
@Injectable()
export class TestRepository {
  constructor(private readonly prisma: PrismaService) {}
  async create(authorId: string, field: Field, createTestDto: CreateTestDto) {
    return this.prisma.test.create({
      data: {
        authorId,
        field,
        ...createTestDto,
      },
    });
  }

  async index() {
    return this.prisma.test.findMany({});
  }

  async find(id: string) {
    return this.prisma.test.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });
  }

  async searchByAuthor(authorId: string) {
    return this.prisma.test.findMany({
      where: {
        authorId,
      },
    });
  }

  async searchByField(field: Field) {
    return this.prisma.test.findMany({
      where: {
        field,
      },
    });
  }

  async update(id: string, updateTestDto: UpdateTestDto) {
    return this.prisma.test.update({
      where: { id },
      data: updateTestDto,
    });
  }

  async delete(id: string) {
    return this.prisma.test.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
