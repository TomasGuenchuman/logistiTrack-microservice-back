import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  // Busca el sessionId activo de un usuario
  async getActiveSession(userId: string): Promise<string | null> {
    return this.redisClient.get(`session:${userId}`);
  }
}