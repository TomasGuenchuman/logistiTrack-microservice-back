import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginData: any) {
    // api-gateway recibe el body (de momento email y password) y se lo pasa ciegamente al auth-service
    return this.authService.login(loginData);
  }
}
