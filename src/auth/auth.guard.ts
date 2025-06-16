import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly reflector: Reflector
  ) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
  const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
  if (isPublic) return true;

  const request = context.switchToHttp().getRequest();
  const token = request.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    console.error('❌ Token missing');
    throw new UnauthorizedException('Token missing');
  }

  try {
    const decoded = this.jwtService.verify(token);
    console.log('✅ Token decoded:', decoded);

    if (!decoded.userId) {
      throw new UnauthorizedException('Invalid token structure');
    }

    const user = await this.userService.findOne(decoded.username);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    request.user = user; // ✅ Attach user info to request
    return true;
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    throw new UnauthorizedException('Invalid or expired token');
  }
}


}
