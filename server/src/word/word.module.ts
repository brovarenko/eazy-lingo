import { Module } from '@nestjs/common';
import { WordController } from './word.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { WordService } from './word.service';

@Module({
  providers: [WordService],
  exports: [WordService],
  controllers: [WordController],
  imports: [PrismaModule],
})
export class WordModule {}
