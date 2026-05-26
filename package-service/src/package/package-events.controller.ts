import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PackagesService } from './package.service';

export interface DeliveryVerifiedEvent {
  orderId: string;
  courierId: string;
  verificationId: string;
  status: 'SUCCESS';
  verifiedAt?: string;
}

@Controller()
export class PackageEventsController {
  constructor(private readonly packagesService: PackagesService) {}

  @EventPattern('delivery.verified')
  async handleDeliveryVerified(@Payload() data: DeliveryVerifiedEvent) {
    console.log('--------------------------------');
    console.log('Evento recibido en package-service');
    console.log('Patrón: delivery.verified');
    console.log('Payload:', data);
    console.log('--------------------------------');

    const { orderId } = data;

    if (!orderId) {
      console.error('El evento delivery.verified no contiene orderId');

      return {
        received: true,
        processed: false,
        reason: 'Missing orderId',
      };
    }

    const updatedPackage = await this.packagesService.markAsDelivered(orderId);

    console.log(`Paquete ${orderId} marcado como DELIVERED`);

    return {
      received: true,
      processed: true,
      packageId: updatedPackage.id,
      status: updatedPackage.status,
    };
  }
}
