import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [SetsController],
  providers: [SetsService, PrismaService, JwtStrategy],
})
export class SetsModule {}
