import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';


@Module({
  imports: [
    forwardRef(() => UsersModule), 
    JwtModule.register({
      secret: 'your_secret_key', // Replace with your secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, JwtModule]
})
export class AuthModule {}
