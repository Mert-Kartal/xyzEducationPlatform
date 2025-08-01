import {
  Controller,
  Post,
  UseGuards,
  Body,
  Req,
  Get,
  Param,
  Query,
  ParseEnumPipe,
  Patch,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { TestService } from './test.service';
import { CreateTestDto, UpdateTestDto } from '../dto';
import { JwtGuard, RoleGuard, Roles } from '../shared';
import { Field, Role } from '@prisma/client';
import { Request } from 'express';

@Controller('tests')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Post()
  async add(@Body() createTestDto: CreateTestDto, @Req() req: Request) {
    return this.testService.add(req.user.userId, createTestDto);
  }

  @Get()
  async list() {
    return this.testService.list();
  }

  @Get('search')
  async searchByField(@Query('field', new ParseEnumPipe(Field)) field: Field) {
    return this.testService.searchByField(field);
  }

  @Get(':id')
  async show(@Param('id', ParseUUIDPipe) id: string) {
    return this.testService.show(id);
  }

  @Get('search/author/:authorId')
  async searchByAuthor(@Param('authorId', ParseUUIDPipe) authorId: string) {
    return this.testService.searchByAuthor(authorId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTestDto: UpdateTestDto,
    @Req() req: Request,
  ) {
    return this.testService.update(id, req.user.userId, updateTestDto);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.testService.delete(id, req.user.userId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Post(':id/questions/:questionId')
  async addQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.testService.addQuestion(id, questionId);
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Roles(Role.Professor)
  @Delete(':id/questions/:questionId')
  async removeQuestion(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('questionId', ParseUUIDPipe) questionId: string,
  ) {
    return this.testService.removeQuestion(id, questionId);
  }
}
