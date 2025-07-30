import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtGuard, RoleGuard, Roles } from '../shared';
import { Role } from '@prisma/client';
import { AdminService } from './admin.service';
import { CreateUserDto, UpdateAdminDto } from '../dto';

@UseGuards(JwtGuard, RoleGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('users')
  async createUser(@Body() data: CreateUserDto) {
    return this.adminService.createUser(data);
  }

  @Get('users')
  async listUsers() {
    return this.adminService.listUsers();
  }

  @Get('users/:id')
  async showUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.showUser(id);
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateAdminDto,
  ) {
    return this.adminService.updateUser(id, data);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteUser(id);
  }

  // Question
  @Delete('questions/:id')
  async deleteQuestion(@Param('id', ParseUUIDPipe) id: string) {
    return this.adminService.deleteQuestion(id);
  }
}
