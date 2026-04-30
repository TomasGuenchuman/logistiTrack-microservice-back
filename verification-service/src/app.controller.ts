import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('PACKAGE_SERVICE')
    private readonly packageClient: ClientProxy,
  ) {}

  @Get('test-redis')
  testRedis() {
    const payload = {
      packageId: 123,
      status: 'DELIVERED',
      verifiedAt: new Date().toISOString(),
    };

    this.packageClient.emit('delivery.verified', payload);

    return {
      message: 'Evento delivery.verified emitido desde verification-service',
      payload,
    };
  }
}
