import {
  Controller,
  Get,
  Patch,
  Delete,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtGuard } from '../shared';
import { Request } from 'express';
import { UpdateUserDto } from '../dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  async getMyProfile(@Req() req: Request) {
    return this.userService.show(req.user.userId);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateMyProfile(@Req() req: Request, @Body() data: UpdateUserDto) {
    return this.userService.update(req.user.userId, data);
  }

  @UseGuards(JwtGuard)
  @Delete('me')
  async deleteMyAccount(@Req() req: Request) {
    return this.userService.delete(req.user.userId);
  }
}
