import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { SharedModule } from '../shared/shared.module';
import { AdminService } from './admin.service';
import { QuestionModule } from '../question';
@Module({
  imports: [UserModule, SharedModule, QuestionModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
