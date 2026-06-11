import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
  @WebSocketServer()
  server!: Server;

  private userSockets: Map<string, string> = new Map();

  private redisSubscriber: Redis;

  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,
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
    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.userSockets.set(userId, client.id);
      console.log(`Usuario ${userId} conectado con socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        console.log(`Usuario ${userId} desconectado`);
        break;
      }
    }
  }

  sendForceLogout(userId: string) {
    const socketId = this.userSockets.get(userId);

    if (socketId) {
      this.server.to(socketId).emit('force_logout', {
        message: 'Sesión cerrada por nuevo inicio de sesión',
      });
    }
  }
}