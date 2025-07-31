import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { QuestionRepository } from './question.repository';
import { PrismaModule } from '../prisma';
import { SharedModule } from '../shared';
import { UserModule } from '../user';
import { OptionRepository, OptionService } from './option';

@Module({
  imports: [PrismaModule, SharedModule, UserModule],
  providers: [
    QuestionService,
    QuestionRepository,
    OptionRepository,
    OptionService,
  ],
  controllers: [QuestionController],
  exports: [QuestionService, OptionService],
})
export class QuestionModule {}
