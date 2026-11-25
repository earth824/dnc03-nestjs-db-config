import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import { HasherModule } from '../hasher/hasher.module.js';
import { UserController } from './user.controller.js';

@Module({
  imports: [HasherModule],
  providers: [UserRepository, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
