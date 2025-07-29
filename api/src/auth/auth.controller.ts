import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from '../dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('logout')
  async logout(@Headers('authorization') authorizationHeader: string) {
    return this.authService.logout(authorizationHeader);
  }

  @Post('refresh')
  async refresh(@Headers('authorization') authorizationHeader: string) {
    return this.authService.refresh(authorizationHeader);
  }
}
