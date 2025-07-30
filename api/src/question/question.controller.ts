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
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../dto';
import { JwtGuard, RoleGuard, Roles } from '../shared';
import { Role } from '@prisma/client';
import { Request } from 'express';

@Controller('question')
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

  @Get(':id')
  async showQuestion(@Param('id') id: string) {
    return this.questionService.show(id);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Patch(':id')
  async updateQuestion(
    @Param('id') id: string,
    @Body() data: UpdateQuestionDto,
    @Req() req: Request,
  ) {
    return this.questionService.edit(req.user.userId, id, data);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Delete(':id')
  async deleteQuestion(@Param('id') id: string, @Req() req: Request) {
    return this.questionService.remove(id, req.user.userId);
  }
}
