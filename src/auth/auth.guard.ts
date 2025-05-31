import { CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => JwtService)) private readonly jwtService: JwtService, // ✅ Fix dependency resolution
    private readonly userService: UsersService,
  ) {}

 async canActivate(context: ExecutionContext): Promise<boolean> {
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
