import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../auth.service.js';
import { Request } from 'express';

export const User = createParamDecorator(
  (data: keyof UserPayload, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<Request>();
    const payload = req.user;
    if (!payload) throw new Error('User decorator must be use with auth guard');
    return data ? payload[data] : payload;
  },
);

// @User('email')
// @Body('email')
