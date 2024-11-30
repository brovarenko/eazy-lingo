import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { WordService } from './word.service';
import { AddWordDto } from './dto/word.dto';

@Controller('words')
export class WordController {
  constructor(private readonly wordService: WordService) {}

  @Post()
  async addWord(@Body() word: AddWordDto) {
    return this.wordService.addWord(word);
  }

  @Get()
  async getWords() {
    return this.wordService.getWords();
  }

  @Delete(':id')
  async deleteWord(@Param('id') id: number) {
    return this.wordService.deleteWord(+id);
  }
}
