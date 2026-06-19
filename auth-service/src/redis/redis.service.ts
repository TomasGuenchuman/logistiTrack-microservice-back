import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Guarda la sesión usando el ID del usuario como llave
  async saveSession(userId: string, sessionId: string, ttlInSeconds: number): Promise<void> {
    // 'EX' le dice a Redis: "Destruí este dato automáticamente cuando pasen los segundos del TTL"
    await this.redisClient.set(`session:${userId}`, sessionId, 'EX', ttlInSeconds);
  }
  // Busca el sessionId activo de un usuario
  async getActiveSession(userId: string): Promise<string | null> {
    return this.redisClient.get(`session:${userId}`);
  }

  // Borra la sesión manualmente cuando el usuario cierra sesión
  async deleteSession(userId: string): Promise<void> {
    await this.redisClient.del(`session:${userId}`);
  }
}