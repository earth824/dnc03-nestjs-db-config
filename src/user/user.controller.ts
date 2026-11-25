import { Controller, Delete } from '@nestjs/common';
import { Role } from '../auth/decorators/role.decorator.js';

@Controller('users')
export class UserController {
  @Role('ADMIN') // 'ROLE' => 'ADMIN'
  @Delete(':id')
  delete() {}
}
