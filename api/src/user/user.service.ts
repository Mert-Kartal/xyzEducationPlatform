import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateAdminDto, UpdateUserDto } from '../dto';
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}
  private async checkById(id: string) {
    const user = await this.userRepository.find(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async checkByEmail(email: string) {
    const user = await this.userRepository.search(email);
    return user ? user : null;
  }

  async add(data: CreateUserDto) {
    const user = await this.checkByEmail(data.email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return this.userRepository.create(data);
  }

  async list() {
    const users = await this.userRepository.index();
    if (users.length === 0) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  async show(id: string) {
    return this.checkById(id);
  }

  async update(id: string, data: UpdateUserDto | UpdateAdminDto) {
    await this.checkById(id);
    if (
      Object.keys(data).length === 0 ||
      Object.values(data).every((value) => value === undefined)
    ) {
      throw new BadRequestException('No data to update');
    }

    if (data.email) {
      const existEmail = await this.checkByEmail(data.email);
      if (existEmail && existEmail.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    return this.userRepository.update(id, data as UpdateUserDto);
  }

  async delete(id: string) {
    await this.checkById(id);
    await this.userRepository.delete(id);
    return { message: 'User deleted successfully' };
  }
}
