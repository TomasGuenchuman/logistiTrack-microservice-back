import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  // Inyectamos el servicio en el constructor
  constructor(private readonly usersService: UsersService) {}

  // Este decorador maneja las peticiones GET a /users
  @Get()
  async findAll() {
    // Delegamos la lógica al servicio y retornamos el resultado
    return await this.usersService.findAll();
  }
}
