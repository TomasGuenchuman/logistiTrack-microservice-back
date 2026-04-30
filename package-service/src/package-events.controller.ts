import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class PackageEventsController {
  @EventPattern('delivery.verified')
  handleDeliveryVerified(@Payload() data: any) {
    console.log('--------------------------------');
    console.log('Evento recibido en package-service');
    console.log('Patrón: delivery.verified');
    console.log('Payload:', data);
    console.log('--------------------------------');

    return {
      received: true,
    };
  }
}
