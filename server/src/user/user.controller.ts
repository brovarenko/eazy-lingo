import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: { email: string }) {
    return this.userService.createUser(body.email);
  }

  @Get(':id')
  async getUserById(@Param('id') id: number) {
    return this.userService.getUserById(id);
  }

  @Post(':id/sets')
  async createSetForUser(
    @Param('id') userId: number,
    @Body() body: { name: string },
  ) {
    return this.userService.createSetForUser(userId, body.name);
  }

  @Get(':id/sets')
  async getUserSets(@Param('id') userId: number) {
    return this.userService.getUserSets(userId);
  }

  @Post(':id/sets/:setId')
  async addUserSet(@Param('id') userId: number, @Param('setId') setId: number) {
    return this.userService.addUserSet(userId, setId);
  }

  @Delete(':id/sets/:setId')
  async removeUserSet(
    @Param('id') userId: number,
    @Param('setId') setId: number,
  ) {
    return this.userService.removeUserSet(userId, setId);
  }

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }
}
