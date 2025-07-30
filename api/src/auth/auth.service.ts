import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../jwt';
import { UserService } from '../user';
import { RegisterDto, LoginDto, CreateUserDto } from '../dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userService.add({
      ...data,
      password: hashedPassword,
    } as CreateUserDto);
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokenPair({
        userId: user.id,
        role: user.role,
      });
    return { user, accessToken, refreshToken };
  }

  async login(data: LoginDto) {
    const user = await this.userService.checkByEmail(data.email);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken, refreshToken } =
      await this.jwtService.generateTokenPair({
        userId: user.id,
        role: user.role,
      });
    return { user, accessToken, refreshToken };
  }

  async logout(authorizationHeader: string) {
    return this.jwtService.logout(authorizationHeader);
  }

  async refresh(authorizationHeader: string) {
    return this.jwtService.refresh(authorizationHeader);
  }
}
