import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { TrainingEventDto } from './dto/training-event.dto';
import { UpdateStatusDto, WordStatusDtoEnum } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @UseGuards(JwtAuthGuard)
  @Post('events')
  async recordEvent(@Req() req, @Body() dto: TrainingEventDto) {
    const userId = req.user.userId;
    return this.progressService.recordTrainingEvent(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(
    @Req() req,
    @Query('status') status?: WordStatusDtoEnum,
    @Query('search') search?: string,
    @Query('setId', ParseIntPipe) setId?: number,
    @Query('take', ParseIntPipe) take?: number,
    @Query('skip', ParseIntPipe) skip?: number,
  ) {
    const userId = req.user.userId;
    return this.progressService.listByStatus({
      userId,
      status,
      search,
      setId,
      take,
      skip,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status')
  async updateStatus(@Req() req, @Body() dto: UpdateStatusDto) {
    const userId = req.user.userId;
    return this.progressService.updateStatus(userId, dto);
  }
}
