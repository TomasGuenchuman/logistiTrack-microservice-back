import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    // api-gateway recibe el body (de momento email y password) y se lo pasa ciegamente al auth-service
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refreshToken(@Body() refreshDto: RefreshDto) {
    // la api-gateway lo recibe y lo pasa al servicio
    return this.authService.refreshToken(refreshDto);
  }

  @Post('logout')
  logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }
}
