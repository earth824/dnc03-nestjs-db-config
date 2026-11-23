import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service.js';
import { ArgonService } from '../hasher/argon.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '../config/config.schema.js';

type RegisterInput = {
  email: string;
  password: string;
};

type UserPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly argonService: ArgonService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async register(input: RegisterInput) {
    const normalizeEmail = input.email.toLowerCase();
    // check if email already exist
    const isUserExist = await this.userService.checkEmailExist(normalizeEmail);
    // if email exist (Error: 409 Conflict)
    if (isUserExist) {
      throw new ConflictException('Email already in use');
    }

    // save new user into database
    const user = this.userService.create(input);
    return user;
  }

  async login(email: string, password: string) {
    // find user by email
    const user = await this.userService.findByEmail(email.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // compare password and passwordHash
    const isMatch = await this.argonService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }
    // generate access token
    const payload: UserPayload = { sub: String(user.id), email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get('JWT_SECRET', { infer: true }),
      expiresIn: this.config.get('JWT_EXPIRES_IN', { infer: true }),
    });
    return accessToken;
  }
}
