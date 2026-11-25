import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { type RegisterDto, registerSchema } from './dto/register.dto.js';
import { type LoginDto, loginSchema } from './dto/login.dto.js';
import { AuthGuard } from './auth.guard.js';
import { User } from './decorators/user.decorator.js';
import { Public } from './decorators/public.decorator.js';

// @Public() // IS_PUBLIC => true
// @UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // IS_PUBLIC => true
  @Post('register')
  register(@Body({ schema: registerSchema }) dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public() // IS_PUBLIC => true
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body({ schema: loginSchema }) dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  // @UseGuards(AuthGuard)
  @Get('me')
  getMe(@User('sub') id: string) {
    return this.authService.getMe(id);
  }
}
