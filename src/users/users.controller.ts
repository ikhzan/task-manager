import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService){}
    
  @Post('register')
  async register(@Body() body: { username: string; password: string; email: string }): Promise<User> {
    return this.userService.create(body.username, body.password, body.email);
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
  @UseGuards(AuthGuard) // ✅ Protect route with authentication
  async getUserProfile(@Request() req) {
    return req.user;
  }


}
