import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Acceso denegado: Token no proporcionado',
      );
    }

    try {
      // desencripto el token y si la firma es falsa o expiró, salta al catch.
      const payload = await this.jwtService.verifyAsync(token);

      // busco en Redis si este usuario (payload.sub) tiene una sesión activa
      const activeSession = await this.redisService.getActiveSession(payload.sub.toString());

      // Comparo si no hay sesión activa o si alguien inició sesión en otro dispositivo
      // en otro lado (y pisó el ID en Redis), bloqueamos el paso al instante.
      if (!activeSession || activeSession !== payload.sessionId) {
        throw new UnauthorizedException(
          'Sesión caducada o iniciada en otro dispositivo',
        );
      }

      // Si pasa los controles, le pegamos los datos a la request y lo dejamos pasar
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
