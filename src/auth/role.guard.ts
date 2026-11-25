import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLE } from './decorators/role.decorator.js';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRole = this.reflector.getAllAndOverride<
      'ADMIN' | 'USER' | undefined
    >(ROLE, [context.getHandler(), context.getClass()]);
    return true;
  }
}
