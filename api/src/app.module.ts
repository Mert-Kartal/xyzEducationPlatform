import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma';
import { UserModule } from './user';
import { JwtModule } from './jwt';
import { AuthModule } from './auth';
import { SharedModule } from './shared';
import { AdminModule } from './admin';
import { QuestionModule } from './question';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    JwtModule,
    AuthModule,
    SharedModule,
    AdminModule,
    QuestionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
