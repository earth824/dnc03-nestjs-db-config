import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Env } from '../config/config.schema.js';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC } from './decorators/public.decorator.js';

// 1. Each Controller Method (@UseGuard)
// 2. All Controller Method (@UseGuard)
// 3. Global - 3.1 useGlobalGuard, 3.2 Provider: APP_GUARD

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // CHECK ROUTE HANDLE is public ?
    // if POST /auth/register
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(
      IS_PUBLIC,
      [
        context.getHandler(), // register, IS_PUBLIC => true
        context.getClass(), // AuthController, IS_PUBLIC => undefined
      ],
    );
    // if it is public bypass this guard (return true)
    if (isPublic) return true;
    // otherwise verify token

    // verify jwt: Authorization: Bearer JWT_TOKEN
    // NESTJS can build HTTP Server, Web Socket Server(Chat), GraphQl, microservice
    // CHAT: client => server, server => client
    // HTTP: client => server, server !=> client
    // ExecutionContext: HTTP(Express.js) | WS | GrapQl | microservice
    const req = context.switchToHttp().getRequest<Request>();
    const authorization = req.headers.authorization; // Bearer JWT_TOKEN
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new BadRequestException('Invalid auth scheme');
    }

    const token = authorization.split(' ')[1];
    try {
      // { sub: string; email: string }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_SECRET', { infer: true }),
      });
      req.user = payload;
    } catch (error) {
      if (
        error instanceof TokenExpiredError ||
        error instanceof JsonWebTokenError
      ) {
        throw new UnauthorizedException('Invalid token');
      }
      throw error;
    }

    return true;
  }
}
