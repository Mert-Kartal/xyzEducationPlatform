import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { AdminService } from './admin.service';

@Module({
  imports: [UserModule, SharedModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
