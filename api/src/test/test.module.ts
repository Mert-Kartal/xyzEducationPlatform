import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TestRepository } from './test.repository';
import { QuestionModule } from '../question';
import { UserModule } from '../user';
import { PrismaModule } from '../prisma';
import { SharedModule } from '../shared';
@Module({
  imports: [QuestionModule, UserModule, PrismaModule, SharedModule],
  providers: [TestService, TestRepository],
  controllers: [TestController],
  exports: [TestService],
})
export class TestModule {}
