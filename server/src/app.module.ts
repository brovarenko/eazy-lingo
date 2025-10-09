import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GoogleStrategy } from './auth/google.strategy';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserController } from './user/user.controller';
import { SetsModule } from './sets/sets.module';
import { WordModule } from './word/word.module';
import { ProgressModule } from './progress/progress.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    PrismaModule,
    SetsModule,
    WordModule,
    ProgressModule,
  ],
  controllers: [AppController, UserController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
