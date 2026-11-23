import { Injectable } from '@nestjs/common';
import { User } from './user.entity.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaClientKnownRequestError } from '../prisma/generated/prisma/internal/prismaNamespace.js';

type CreateUserData = {
  email: string;
  password: string;
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserData) {
    try {
      const user = await this.prisma.user.create({ data });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return null;
      }
      throw error;
    }
  }
}
