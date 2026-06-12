import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private userSockets: Map<string, Map<string,string>> = new Map();

  private redisSubscriber: Redis;

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {
    /**
     * Importante:
     * No usamos directamente redisClient para subscribe,
     * porque una conexión de Redis en modo subscriber queda dedicada a eso.
     */
    this.redisSubscriber = this.redisClient.duplicate();
  }

  async onModuleInit() {
    this.redisSubscriber.on('error', (error) => {
      console.error('Error en Redis subscriber:', error.message);
    });

    await this.redisSubscriber.subscribe('user_sessions');

    console.log('API Gateway suscripto al canal Redis: user_sessions');

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'user_sessions') {
        const data = JSON.parse(message);

        if (data.action === 'FORCE_LOGOUT') {
          this.sendForceLogout(data.userId);
        }
      }
    });
  }

  async onModuleDestroy() {
    await this.redisSubscriber.quit();
  }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      const deviceId = client.handshake.query.deviceId as string;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Map());
      }
      this.userSockets.get(userId)!.set(deviceId, client.id);
    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, deviceSockets] of this.userSockets.entries()) {
      for (const [deviceId, socketId] of deviceSockets.entries()) {
        if (socketId === client.id) {
          deviceSockets.delete(deviceId);
          if (deviceSockets.size === 0) {
            this.userSockets.delete(userId);
          }
          return;
        }
      }
    }
  }

  sendForceLogout(userId: string, exceptDevice?: string) {
    const deviceSockets = this.userSockets.get(userId);
      if (!deviceSockets) return;

      for (const [deviceId, socketId] of deviceSockets.entries()) {
        if (deviceId === exceptDevice) continue;
        this.server.to(socketId).emit('force_logout', {
          message: 'Sesión cerrada por nuevo inicio de sesión'
        });
      }
  }
}