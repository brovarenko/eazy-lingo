import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  Req,
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
    @Query('setId') setIdRaw?: string,
    @Query('take') takeRaw?: string,
    @Query('skip') skipRaw?: string,
  ) {
    const userId = req.user.userId;
    const setId = setIdRaw !== undefined ? Number(setIdRaw) : undefined;
    const take = takeRaw !== undefined ? Number(takeRaw) : undefined;
    const skip = skipRaw !== undefined ? Number(skipRaw) : undefined;

    return this.progressService.listByStatus({
      userId,
      status,
      search,
      setId: Number.isFinite(setId as number) ? (setId as number) : undefined,
      take: Number.isFinite(take as number) ? (take as number) : undefined,
      skip: Number.isFinite(skip as number) ? (skip as number) : undefined,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch('status')
  async updateStatus(@Req() req, @Body() dto: UpdateStatusDto) {
    const userId = req.user.userId;
    return this.progressService.updateStatus(userId, dto);
  }
}
