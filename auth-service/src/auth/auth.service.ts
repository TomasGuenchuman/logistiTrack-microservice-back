import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';


// Definición del contrato
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(email: string, pass: string): Promise<AuthResponse> {
    // busco al usuario por su email
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // comparo la contraseña enviada con el hash de la BBDD
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // si todo esta bien, genero el token VIP
    const sessionId = randomUUID();
    const payload = { sub: user.id, email: user.email, sessionId };

    const access_token = await this.jwtService.signAsync(payload, { expiresIn: '40m' });
    const refresh_token = await this.jwtService.signAsync(payload, { expiresIn: '7d' });

    await this.redisService.saveSession(user.id.toString(), sessionId, 604800); // 7 días en segundos

    await this.redisService.publish('user_sessions', JSON.stringify({
      userId: user.id.toString(),
      action: 'FORCE_LOGOUT'
    }));

    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
      }
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // verifico el token sea valido y desencripto los datos los datos
      const payload = await this.jwtService.verifyAsync(refreshToken);

      // busco en Redis si la sesión de este usuario sigue activa
      const activeSession = await this.redisService.getActiveSession(payload.sub.toString());

      // comparo si la sesion cerró o no coincide, y si es asi bloqueo el paso
      if (!activeSession || activeSession !== payload.sessionId) {
        throw new UnauthorizedException('Sesión inválida o revocada');
      }

      // si todo esta bien, genero el nuevo access token de 40 minutos
      const newPayload = { sub: payload.sub, email: payload.email, sessionId: payload.sessionId };
      const newAccessToken = await this.jwtService.signAsync(newPayload, { expiresIn: '40m' });

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(userId: string) {
    // borro la sesion de Redis para invalidar cualquier refresh token
    await this.redisService.deleteSession(userId.toString());
    
    return { message: 'Sesión cerrada exitosamente' };
  }
}