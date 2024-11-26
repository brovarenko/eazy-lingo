import { Module } from '@nestjs/common';
import { SetsController } from './sets.controller';
import { SetsService } from './sets.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SetsController],
  providers: [SetsService, PrismaService],
})
export class SetsModule {}
