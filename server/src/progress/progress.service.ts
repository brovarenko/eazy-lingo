import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrainingEventDto } from './dto/training-event.dto';
import { UpdateStatusDto, WordStatusDtoEnum } from './dto/update-status.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  private statusPromotionThreshold = 3; // streak needed to mark LEARNED

  async recordTrainingEvent(userId: number, dto: TrainingEventDto) {
    const now = new Date();
    const prismaAny = this.prisma as any;
    const existing = await prismaAny.userWordProgress.findUnique({
      where: { userId_wordId: { userId, wordId: dto.wordId } },
    });

    let correctCount = existing?.correctCount ?? 0;
    let wrongCount = existing?.wrongCount ?? 0;
    let streak = existing?.streak ?? 0;
    let status = existing?.status ?? 'LEARNING';
    let firstLearnedAt = existing?.firstLearnedAt ?? null;

    if (dto.result === 'correct') {
      correctCount += 1;
      streak += 1;
      // Auto-promote to LEARNED
      if (streak >= this.statusPromotionThreshold && status !== 'KNOWN') {
        status = 'LEARNED' as any;
        if (!firstLearnedAt) firstLearnedAt = now;
      }
      if (status === 'NEW') status = 'LEARNING' as any;
    } else {
      wrongCount += 1;
      streak = 0;
      if (status === 'NEW') {
        // keep NEW
      } else if (status !== 'KNOWN') {
        status = 'LEARNING' as any;
      }
    }

    const progress = await prismaAny.userWordProgress.upsert({
      where: { userId_wordId: { userId, wordId: dto.wordId } },
      update: {
        correctCount,
        wrongCount,
        streak,
        status: status as any,
        lastAnsweredAt: now,
        firstLearnedAt,
      },
      create: {
        userId,
        wordId: dto.wordId,
        status: status as any,
        correctCount,
        wrongCount,
        streak,
        lastAnsweredAt: now,
        firstLearnedAt,
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
    const prismaAny = this.prisma as any;
    return prismaAny.userWordProgress.findMany({
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
    const prismaAny = this.prisma as any;
    return prismaAny.userWordProgress.upsert({
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
