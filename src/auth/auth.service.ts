import { Injectable } from '@nestjs/common';

type RegisterInput = {
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  register(input: RegisterInput) {
    // check if email already exist
    // if email exist (Error: 409 Conflict)
    // email not exist (Hash a password)
    // save new user into database
  }
}
