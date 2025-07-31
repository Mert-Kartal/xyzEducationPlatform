import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';
import { JwtGuard, RoleGuard, Roles } from '../shared';
import { Field, Role } from '@prisma/client';
import { Request } from 'express';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Post()
  async createQuestion(@Body() data: CreateQuestionDto, @Req() req: Request) {
    return this.questionService.add(req.user.userId, data);
  }

  @Get()
  async listQuestions() {
    return this.questionService.list();
  }

  @Get('search')
  async searchQuestions(
    @Query('field', new ParseEnumPipe(Field)) field: Field,
  ) {
    console.log(field);
    return this.questionService.search(field);
  }

  @Get('author/:authorId')
  async listQuestionsByAuthor(
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ) {
    return this.questionService.searchByAuthor(authorId);
  }

  @Get(':id')
  async showQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.questionService.show(id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Patch(':id')
  async updateQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateQuestionDto,
    @Req() req: Request,
  ) {
    return this.questionService.edit(req.user.userId, id, data);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Delete(':id')
  async deleteQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    return this.questionService.remove(id, req.user.userId);
  }
}
