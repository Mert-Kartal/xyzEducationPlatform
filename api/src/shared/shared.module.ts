import { Module } from '@nestjs/common';
import { JwtGuard, RoleGuard } from './guard';
import { JwtModule } from '../jwt';

@Module({
  imports: [JwtModule],
  providers: [JwtGuard, RoleGuard],
  exports: [JwtGuard, RoleGuard],
})
export class SharedModule {}
