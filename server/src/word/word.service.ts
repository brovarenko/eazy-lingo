import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddWordDto } from './dto/word.dto';

@Injectable()
export class WordService {
  constructor(private readonly prisma: PrismaService) {}

  // Add a new word
  async addWord(word: AddWordDto) {
    return this.prisma.word.create({
      data: word,
    });
  }

  // Get all words
  async getWords() {
    return this.prisma.word.findMany();
  }

  // Delete a word
  async deleteWord(id: number) {
    return this.prisma.word.delete({
      where: { id },
    });
  }
}
