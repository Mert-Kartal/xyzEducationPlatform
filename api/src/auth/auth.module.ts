import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '../jwt';
import { UserModule } from '../user';
@Module({
  providers: [AuthService],
  imports: [UserModule, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
