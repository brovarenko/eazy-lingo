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
import {
  CreateSetDto,
  UpdateSetDto,
  AddExistingWordDto,
} from './dto/create-set.dto';
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

  @UseGuards(JwtAuthGuard)
  @Get(':id/words')
  async getSetWords(@Param('id', ParseIntPipe) id: number, @Req() req) {
    console.log(req);
    const userId = req.user.userId;
    return this.setsService.getWordsFromUserSet(userId, id);
  }

  @Get(':id')
  async getSetById(@Param('id', ParseIntPipe) id: number) {
    return this.setsService.getSetById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSet(@Body() createSetDto: CreateSetDto, @Req() req) {
    const userId = req.user.userId;
    return this.setsService.createSet(createSetDto, userId);
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
    @Body() addExistingWordDto: AddExistingWordDto,
  ) {
    return this.setsService.addExistingWordToSet(id, addExistingWordDto);
  }
}
