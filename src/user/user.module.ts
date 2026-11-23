import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import { HasherModule } from '../hasher/hasher.module.js';

@Module({
  imports: [HasherModule],
  providers: [UserRepository, UserService],
  exports: [UserService],
})
export class UserModule {}
