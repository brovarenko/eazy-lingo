import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new user
  async createUser(email: string) {
    return this.prisma.user.create({
      data: { email },
    });
  }

  // Find a user by ID
  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        sets: true, // Include sets owned by the user
        chosenSets: { include: { set: true } }, // Include sets the user is using
      },
    });
  }

  // Add a set to a user's chosen sets
  async addUserSet(userId: number, setId: number) {
    return this.prisma.userSet.create({
      data: {
        userId,
        setId,
      },
    });
  }

  // Remove a set from a user's chosen sets
  async removeUserSet(userId: number, setId: number) {
    return this.prisma.userSet.delete({
      where: {
        userId_setId: { userId, setId },
      },
    });
  }

  // Get all users
  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        sets: true,
        chosenSets: { include: { set: true } },
      },
    });
  }

  // Create a set and assign it to a user
  async createSetForUser(userId: number, setName: string) {
    return this.prisma.set.create({
      data: {
        name: setName,
        userId,
      },
    });
  }

  // Get all sets for a user
  async getUserSets(userId: number) {
    return this.prisma.set.findMany({
      where: { userId },
      include: { words: true },
    });
  }

  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
