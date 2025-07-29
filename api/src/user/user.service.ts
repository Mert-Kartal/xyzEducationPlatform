import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from '../dto';
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
    return this.userRepository.index();
  }

  async show(id: string) {
    return this.checkById(id);
  }

  async update(id: string, data: UpdateUserDto) {
    await this.checkById(id);

    if (data.email) {
      const existEmail = await this.checkByEmail(data.email);
      if (existEmail) {
        if (existEmail.id !== id) {
          throw new BadRequestException('Can not change email with same email');
        }
        throw new ConflictException('Email already exists');
      }
    }

    return this.userRepository.update(id, data);
  }

  async delete(id: string) {
    await this.checkById(id);
    return this.userRepository.delete(id);
  }
}
