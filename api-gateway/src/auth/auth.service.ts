import {
  Injectable,
  BadGatewayException,
  UnauthorizedException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('AUTH_SERVICE_URL');
    if (!url) {
      throw new Error('AUTH_SERVICE_URL is not defined');
    }

    this.authServiceUrl = url;
  }

  async login(loginData: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, loginData),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async refreshToken(refreshData: any) {
    try {
      const response = await firstValueFrom(
        // le pega a la ruta /auth/refresh del microservicio
        this.httpService.post(
          `${this.authServiceUrl}/auth/refresh`,
          refreshData,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async logout(logoutData: any) {
    try {
      const response = await firstValueFrom(
        // le pega a la ruta /auth/logout del microservicio
        this.httpService.post(`${this.authServiceUrl}/auth/logout`, logoutData),
      );
      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private handleHttpError(error: unknown): never {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const message =
        axiosError.response.data?.message ??
        axiosError.response.data ??
        'Error from auth-service';

      // si el microservicio dice que la contraseña está mal (401), aviso al cliente
      if (status === 401) {
        throw new UnauthorizedException(message);
      }

      throw new BadGatewayException({
        message: 'Error communicating with auth-service',
        authServiceStatusCode: status,
        authServiceMessage: message,
      });
    }

    throw new BadGatewayException(
      'auth-service is not available or did not respond',
    );
  }
}
