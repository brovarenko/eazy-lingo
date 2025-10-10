import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrainingEventDto } from './dto/training-event.dto';
import { UpdateStatusDto, WordStatusDtoEnum } from './dto/update-status.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly statusPromotionThreshold = 3; // streak needed to mark LEARNED

  private get repo() {
    return (this.prisma as any).userWordProgress as any;
  }

  private applyResult(
    existing: any | null,
    result: 'correct' | 'wrong',
    now: Date,
  ) {
    let correctCount = existing?.correctCount ?? 0;
    let wrongCount = existing?.wrongCount ?? 0;
    let streak = existing?.streak ?? 0;
    let status = (existing?.status ?? 'LEARNING') as any;
    let firstLearnedAt = existing?.firstLearnedAt ?? undefined;

    if (result === 'correct') {
      correctCount += 1;
      streak += 1;
      if (status === 'NEW') status = 'LEARNING';
      if (streak >= this.statusPromotionThreshold && status !== 'KNOWN') {
        status = 'LEARNED';
        if (!firstLearnedAt) firstLearnedAt = now;
      }
    } else {
      wrongCount += 1;
      streak = 0;
      if (status !== 'KNOWN') {
        status = status === 'NEW' ? 'NEW' : 'LEARNING';
      }
    }

    return {
      correctCount,
      wrongCount,
      streak,
      status,
      lastAnsweredAt: now,
      firstLearnedAt,
    };
  }

  async recordTrainingEvent(userId: number, dto: TrainingEventDto) {
    const now = new Date();
    const existing = await this.repo.findUnique({
      where: { userId_wordId: { userId, wordId: dto.wordId } },
    });

    const payload = this.applyResult(existing, dto.result, now);

    const progress = await this.repo.upsert({
      where: { userId_wordId: { userId, wordId: dto.wordId } },
      update: {
        ...payload,
      },
      create: {
        userId,
        wordId: dto.wordId,
        ...payload,
      },
    });

    return progress;
  }

  async listByStatus(params: {
    userId: number;
    status?: WordStatusDtoEnum;
    search?: string;
    setId?: number;
    take?: number;
    skip?: number;
  }) {
    const { userId, status, search, setId, take = 50, skip = 0 } = params;
    return this.repo.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
        ...(search
          ? {
              word: {
                OR: [
                  { english: { contains: search, mode: 'insensitive' } },
                  { german: { contains: search, mode: 'insensitive' } },
                  { perfekt: { contains: search, mode: 'insensitive' } },
                ],
              },
            }
          : {}),
        ...(setId ? { word: { setId } } : {}),
      },
      include: { word: true },
      orderBy: { lastAnsweredAt: 'desc' },
      take,
      skip,
    });
  }

  async updateStatus(userId: number, dto: UpdateStatusDto) {
    const now = new Date();
    return this.repo.upsert({
      where: { userId_wordId: { userId, wordId: dto.wordId } },
      update: { status: dto.status as any, lastAnsweredAt: now },
      create: {
        userId,
        wordId: dto.wordId,
        status: dto.status as any,
        lastAnsweredAt: now,
      },
    });
  }
}
