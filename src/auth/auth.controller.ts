import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        console.log("login: " + body.username + " password: " + body.password);
        return this.authService.login(body.username, body.password);
    }


    @Post('refresh')
    async refresh(@Body() body: { refreshToken: string }) {
        return this.authService.refreshToken(body.refreshToken);
    }

}
