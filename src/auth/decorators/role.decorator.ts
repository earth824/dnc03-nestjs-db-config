import { SetMetadata } from '@nestjs/common';

export const ROLE = 'ROLE';
export const Role = (allowedRole: 'ADMIN' | 'USER') =>
  SetMetadata(ROLE, allowedRole);
