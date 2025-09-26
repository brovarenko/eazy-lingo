import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSetDto,
  UpdateSetDto,
  AddWordDto,
  AddExistingWordDto,
} from './dto/create-set.dto';

@Injectable()
export class SetsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSets(isCommon?: boolean | string) {
    let isCommonBool: boolean | undefined = undefined;
    if (typeof isCommon === 'string') {
      if (isCommon.toLowerCase() === 'true') isCommonBool = true;
      else if (isCommon.toLowerCase() === 'false') isCommonBool = false;
    } else if (typeof isCommon === 'boolean') {
      isCommonBool = isCommon;
    }

    return this.prisma.set.findMany({
      where:
        isCommonBool !== undefined ? { isCommon: isCommonBool } : undefined,
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

  async createSet(createSetDto: CreateSetDto, userId: number) {
    return this.prisma.set.create({
      data: {
        name: createSetDto.name,
        isCommon: createSetDto.isCommon,
        userId,
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

  async addExistingWordToSet(
    setId: number,
    addExistingWordDto: AddExistingWordDto,
  ) {
    const word = await this.prisma.word.findUnique({
      where: { id: addExistingWordDto.wordId },
    });

    if (!word) {
      throw new NotFoundException('Word not found');
    }

    const set = await this.prisma.set.findUnique({
      where: { id: setId },
    });

    if (!set) {
      throw new NotFoundException('Set not found');
    }

    return this.prisma.word.update({
      where: { id: addExistingWordDto.wordId },
      data: { setId },
    });
  }

  async removeWordFromSet(userId: number, setId: number, wordId: number) {
    const set = await this.prisma.set.findFirst({
      where: { id: setId, userId },
      select: { id: true },
    });

    if (!set) {
      throw new NotFoundException('Set not found');
    }

    const word = await this.prisma.word.findFirst({
      where: { id: wordId, setId },
    });

    if (!word) {
      throw new NotFoundException('Word not found in set');
    }

    return this.prisma.word.update({
      where: { id: wordId },
      data: { setId: null },
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