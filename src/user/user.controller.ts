import { Controller, Delete } from '@nestjs/common';

@Controller('users')
export class UserController {
  @Delete()
  delete() {}
}
