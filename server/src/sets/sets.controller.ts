import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { SetsService } from './sets.service';
import { CreateSetDto, UpdateSetDto, AddWordDto } from './dto/create-set.dto';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @Get()
  async getAllSets(@Query('isCommon') isCommon: boolean) {
    return this.setsService.getAllSets(isCommon);
  }

  @Get(':id')
  async getSetById(@Param('id', ParseIntPipe) id: number) {
    return this.setsService.getSetById(id);
  }

  @Post()
  async createSet(@Body() createSetDto: CreateSetDto) {
    return this.setsService.createSet(createSetDto);
  }

  @Put(':id')
  async updateSet(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSetDto: UpdateSetDto,
  ) {
    return this.setsService.updateSet(id, updateSetDto);
  }

  @Delete(':id')
  async deleteSet(@Param('id', ParseIntPipe) id: number) {
    return this.setsService.deleteSet(id);
  }

  @Post(':id/words')
  async addWordToSet(
    @Param('id', ParseIntPipe) id: number,
    @Body() addWordDto: AddWordDto,
  ) {
    return this.setsService.addWordToSet(id, addWordDto);
  }
}
