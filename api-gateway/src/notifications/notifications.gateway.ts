import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';


@WebSocketGateway({ cors: true })
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private userSockets: Map<string, string> = new Map();

  constructor(
    private readonly jwtService: JwtService,
  ) {
  }

  handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      const payload = this.jwtService.verify(token);
      console.log('B1 - handleConnection');
      const userId = payload.sub;
      const existingDevices = this.userSockets.get(userId);

      console.log('B2 - userId: ', userId, '  sessionId: ', payload.sessionId);
      if (existingDevices) {
        this.sendForceLogout(userId);
      }
      

      this.userSockets.set(userId, client.id);

    } catch (error) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        return;
      }
    }
  }

  sendForceLogout(userId: string) {
    const socketId = this.userSockets.get(userId);

    if (!socketId) return;

    this.server.to(socketId).emit('force_logout', {
    message: 'Sesión cerrada por nuevo inicio de sesión'
  });
  }
}