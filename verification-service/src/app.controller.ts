import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AppService } from './app.service';

type DeliveryVerifiedEvent = {
  orderId: string;
  courierId: string;
  verificationId: string;
  status: 'SUCCESS';
  verifiedAt?: string;
};

@Controller()
export class AppController {
  constructor(
    @Inject('PACKAGE_SERVICE')
    private readonly packageClient: ClientProxy,
    private readonly appService: AppService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-redis')
  testRedis() {
    const payload: DeliveryVerifiedEvent = {
      orderId: '9ac14219-addd-4f4c-94a0-11ad4d7057bc',
      courierId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      verificationId: 'v1a2b3c4-9999-8888-7777-fedcbafedcba',
      status: 'SUCCESS',
      verifiedAt: new Date().toISOString(),
    };

    this.packageClient.emit('delivery.verified', payload);

    return {
      message: 'Evento delivery.verified emitido desde verification-service',
      payload,
    };
  }
}
