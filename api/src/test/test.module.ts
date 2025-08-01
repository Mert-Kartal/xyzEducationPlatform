import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestRepository } from './test.repository';
import { QuestionModule } from '../question';
import { UserModule } from '../user';
import { PrismaModule } from '../prisma';
import { SharedModule } from '../shared';
import { AnswerService, AnswerRepository } from './answer';
@Module({
  imports: [QuestionModule, UserModule, PrismaModule, SharedModule],
  providers: [TestService, TestRepository, AnswerService, AnswerRepository],
  controllers: [TestController],
  exports: [TestService, AnswerService],
})
export class TestModule {}
