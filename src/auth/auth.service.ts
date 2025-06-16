import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any | null> {
        const user = await this.userService.findOne(username);
        console.log('🔍 ValidateUser Found:', user); // ✅ Debugging step

        if (!user) return null;

        const isValidPassword = await bcrypt.compare(password, user.password);
        return isValidPassword ? user : null;
    }


    async login(username: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const user = await this.validateUser(username, password);
        const payload = { userId: user._id.toString(), username: user.username }; // ✅ Ensure userId is included

        return this.generateTokens(payload)
    }

    async generateTokens(payload: { userId: string; username: string }):
        Promise<{ accessToken: string; refreshToken: string; userId: string }> {
        const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        return { accessToken, refreshToken, userId: payload.userId }; // ✅ Return userId explicitly
    }

    async refreshToken(refreshToken: string): Promise<string> {
        try {
            const decoded = this.jwtService.verify(refreshToken);
            return this.jwtService.sign({ userId: decoded.userId }, { expiresIn: '1h' });
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

}
