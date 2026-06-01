import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // api-gateway recibe el body (de momento email y password) y se lo pasa ciegamente al auth-service
    return this.authService.login(loginDto);
  }
}
