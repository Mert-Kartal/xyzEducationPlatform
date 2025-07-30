import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { PrismaModule } from '../prisma';
import { SharedModule } from '../shared';
import { UserModule } from '../user';
@Module({
  imports: [PrismaModule, SharedModule, UserModule],
  providers: [QuestionService, QuestionRepository],
  controllers: [QuestionController],
  exports: [QuestionService],
})
export class QuestionModule {}
