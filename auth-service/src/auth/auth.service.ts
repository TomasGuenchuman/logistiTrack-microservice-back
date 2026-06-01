import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

  async login(email: string, pass: string) {
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
    
    return {
      access_token,
      refresh_token,
      user: {
        id: user.id,
        email: user.email,
      }
    };
  }
}