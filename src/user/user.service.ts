import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository.js';
import { User } from './user.entity.js';
import { ArgonService } from '../hasher/argon.service.js';

type CreateUserInput = {
  email: string;
  password: string;
};

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly argonService: ArgonService,
  ) {}

  async checkEmailExist(email: string): Promise<boolean> {
    const existUser = await this.userRepository.findByEmail(email);
    return existUser !== null;
  }

  async create(input: CreateUserInput): Promise<User> {
    // email not exist (Hash a password)
    const passwordHash = await this.argonService.hash(input.password);
    // repository
    const user = await this.userRepository.create({
      ...input,
      password: passwordHash,
    });
    if (!user) {
      throw new ConflictException('Email already in use');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
}
