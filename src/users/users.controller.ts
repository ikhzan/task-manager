import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService){}

  @Get()
  fetchUsers(){
    return this.userService.getAllUsers()
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get(':userId/teams')
  getUserTeams(@Param('userId') userId: string) {
    return this.userService.getUserTeams(userId);
  }

  @Get('profile')
  async getUserProfile(@Request() req) {
    return req.user;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
      return this.userService.remove(id);
  }

}
