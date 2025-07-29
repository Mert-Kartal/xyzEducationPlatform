import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UserModule } from './user';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
