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
  UseGuards,
  Req,
} from '@nestjs/common';
import { SetsService } from './sets.service';
import { CreateSetDto, UpdateSetDto, AddWordDto } from './dto/create-set.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('sets')
export class SetsController {
  constructor(private readonly setsService: SetsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllSets(@Query('isCommon') isCommon: boolean) {
    console.log('Request reached SetsController');
    return this.setsService.getAllSets(isCommon);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user')
  async getUserSets(@Req() req) {
    const userId = req.user.userId;
    return this.setsService.getUserSets(userId);
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
