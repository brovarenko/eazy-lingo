import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSetDto, UpdateSetDto, AddWordDto } from './dto/create-set.dto';

@Injectable()
export class SetsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSets(isCommon?: boolean) {
    return this.prisma.set.findMany({
      where: isCommon !== undefined ? { isCommon } : undefined,
      include: {
        words: true,
        user: true,
      },
    });
  }

  async getSetById(id: number) {
    const set = await this.prisma.set.findUnique({
      where: { id },
      include: { words: true },
    });
    if (!set) {
      throw new NotFoundException('Set not found');
    }
    return set;
  }

  async createSet(createSetDto: CreateSetDto) {
    return this.prisma.set.create({
      data: {
        name: createSetDto.name,
        isCommon: createSetDto.isCommon,
        userId: createSetDto.userId,
      },
    });
  }

  async updateSet(id: number, updateSetDto: UpdateSetDto) {
    return this.prisma.set.update({
      where: { id },
      data: updateSetDto,
    });
  }

  async deleteSet(id: number) {
    return this.prisma.set.delete({ where: { id } });
  }

  async addWordToSet(setId: number, addWordDto: AddWordDto) {
    return this.prisma.word.create({
      data: {
        english: addWordDto.english,
        german: addWordDto.german,
        thirdForm: addWordDto.thirdForm,
        perfekt: addWordDto.perfekt,
        setId,
      },
    });
  }

  async getWordsFromUserSet(userId: number, setId: number) {
    const set = await this.prisma.set.findFirst({
      where: {
        id: setId,
        userId: userId,
      },
      select: {
        words: true,
      },
    });

    return set?.words || [];
  }

  async getUserSets(userId: number) {
    return this.prisma.set.findMany({
      where: { userId },
      include: { words: true },
    });
  }
}
