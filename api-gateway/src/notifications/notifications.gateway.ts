import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayConnection, 
  OnGatewayDisconnect 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';

@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit {
  @WebSocketServer()
  server!: Server;

  // mapa del tipo llave-valor para { userId: socketId }
  private userSockets: Map<string, string> = new Map();

  private redisSubscriber: Redis;

  constructor() {
    // inyecto la dependencia de Redis para suscribirme a los eventos de sesión
    this.redisSubscriber = new Redis(); 
  }

  onModuleInit() {
    // me suscribo al canal de Redis donde se publican los eventos de sesión
    this.redisSubscriber.subscribe('user_sessions');

    // escucho los eventos publicados en ese canal
    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'user_sessions') {
        const data = JSON.parse(message);
        
        // si el evento es FORCE_LOGOUT, se cierra la sesion del usuario con ese id
        if (data.action === 'FORCE_LOGOUT') {
          this.sendForceLogout(data.userId);
        }
      }
    });
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

  // para hacer el logout a la fuerza
  sendForceLogout(userId: string) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('force_logout', { 
        message: 'Sesión cerrada por nuevo inicio de sesión' 
      });
    }
  }
}