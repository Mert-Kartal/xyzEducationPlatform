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
import {
  CreateOptionDto,
  CreateQuestionDto,
  UpdateOptionDto,
  UpdateQuestionDto,
} from '../dto';
import { JwtGuard, RoleGuard, Roles } from '../shared';
import { OptionService } from './option';
import { Field, Role } from '@prisma/client';
import { Request } from 'express';

@Controller('questions')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly optionService: OptionService,
  ) {}

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

  //options
  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Post(':id/options')
  async createOption(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: CreateOptionDto,
    @Req() req: Request,
  ) {
    return this.optionService.add(id, data, req.user.userId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Patch(':id/options/:optionId')
  async updateOption(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Body() data: UpdateOptionDto,
    @Req() req: Request,
  ) {
    return this.optionService.edit(id, optionId, req.user.userId, data);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Delete(':id/options/:optionId')
  async deleteOption(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('optionId', ParseUUIDPipe) optionId: string,
    @Req() req: Request,
  ) {
    return this.optionService.remove(id, optionId, req.user.userId);
  }
}
