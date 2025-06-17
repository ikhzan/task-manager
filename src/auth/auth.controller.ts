import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        console.log("login: " + body.username + " password: " + body.password);
        return this.authService.login(body.username, body.password);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        return this.authService.register(createUserDto);
    }


    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(body.refreshToken);
    }

}
