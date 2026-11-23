import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository.js';

@Module({
  providers: [UserRepository],
})
export class UserModule {}
