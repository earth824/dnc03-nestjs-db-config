import 'express';
import { UserPayload } from '../auth/auth.service.ts';

declare module 'express' {
  interface Request {
    user?: UserPayload;
  }
}
