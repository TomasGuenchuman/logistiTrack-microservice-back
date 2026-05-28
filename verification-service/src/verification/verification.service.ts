import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';

import {
  Verification,
  VerificationStatus,
} from './entities/verification.entity';

import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';

export interface DeliveryVerifiedEvent {
  orderId: string;
  courierId: string;
  verificationId: string;
  status: 'SUCCESS';
  verifiedAt: string;
}

@Injectable()
export class VerificationsService {
  constructor(
    @InjectRepository(Verification)
    private readonly verificationRepository: Repository<Verification>,

    /**
     * Cliente Redis configurado en el módulo.
     * Este cliente emite eventos hacia otros microservicios.
     */
    @Inject('REDIS_CLIENT')
    private readonly redisClient: ClientProxy,
  ) {}

  async create(
    createVerificationDto: CreateVerificationDto,
  ): Promise<Verification> {
    const verification = this.verificationRepository.create({
      orderId: createVerificationDto.orderId,
      qrHash: createVerificationDto.qrHash,
      signatureData: createVerificationDto.signatureData,
      verifiedBy: createVerificationDto.verifiedBy,
      status: createVerificationDto.status ?? VerificationStatus.SUCCESS,
      verifiedAt: createVerificationDto.verifiedAt
        ? new Date(createVerificationDto.verifiedAt)
        : new Date(),
    });

    const savedVerification =
      await this.verificationRepository.save(verification);

    /**
     * Regla de negocio:
     * Si la verificación fue exitosa, se emite evento a Redis.
     */
    if (savedVerification.status === VerificationStatus.SUCCESS) {
      await this.emitDeliveryVerified(savedVerification);
    }

    return savedVerification;
  }

  async findAll(): Promise<Verification[]> {
    return this.verificationRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Verification> {
    const verification = await this.verificationRepository.findOne({
      where: { id },
    });

    if (!verification) {
      throw new NotFoundException(
        `No se encontró la verificación con id ${id}`,
      );
    }

    return verification;
  }

  async findByOrder(orderId: string): Promise<Verification[]> {
    const verifications = await this.verificationRepository.find({
      where: { orderId },
      order: {
        createdAt: 'DESC',
      },
    });

    return verifications;
  }

  async update(
    id: string,
    updateVerificationDto: UpdateVerificationDto,
  ): Promise<Verification> {
    const verification = await this.findOne(id);

    if (updateVerificationDto.orderId !== undefined) {
      verification.orderId = updateVerificationDto.orderId;
    }

    if (updateVerificationDto.qrHash !== undefined) {
      verification.qrHash = updateVerificationDto.qrHash;
    }

    if (updateVerificationDto.signatureData !== undefined) {
      verification.signatureData = updateVerificationDto.signatureData;
    }

    if (updateVerificationDto.verifiedBy !== undefined) {
      verification.verifiedBy = updateVerificationDto.verifiedBy;
    }

    if (updateVerificationDto.status !== undefined) {
      verification.status = updateVerificationDto.status;
    }

    if (updateVerificationDto.verifiedAt !== undefined) {
      verification.verifiedAt = new Date(updateVerificationDto.verifiedAt);
    }

    const updatedVerification =
      await this.verificationRepository.save(verification);

    /**
     * Si después del update quedó en SUCCESS,
     * se puede emitir el evento.
     *
     * Ojo: esto puede emitir eventos duplicados si actualizás muchas veces
     * una verificación ya exitosa. Más abajo te explico cómo mejorarlo.
     */
    if (updatedVerification.status === VerificationStatus.SUCCESS) {
      await this.emitDeliveryVerified(updatedVerification);
    }

    return updatedVerification;
  }

  async updateStatus(
    id: string,
    status: VerificationStatus,
  ): Promise<Verification> {
    const verification = await this.findOne(id);

    verification.status = status;

    if (status === VerificationStatus.SUCCESS) {
      verification.verifiedAt = verification.verifiedAt ?? new Date();
    }

    const updatedVerification =
      await this.verificationRepository.save(verification);

    if (updatedVerification.status === VerificationStatus.SUCCESS) {
      await this.emitDeliveryVerified(updatedVerification);
    }

    return updatedVerification;
  }

  async remove(id: string): Promise<void> {
    const verification = await this.findOne(id);

    await this.verificationRepository.remove(verification);
  }

  async emitDeliveryVerified(
    verification: Verification,
  ): Promise<DeliveryVerifiedEvent> {
    if (verification.status !== VerificationStatus.SUCCESS) {
      throw new BadRequestException(
        'Solo se puede emitir delivery.verified si la verificación fue SUCCESS',
      );
    }

    if (!verification.verifiedAt) {
      verification.verifiedAt = new Date();
      await this.verificationRepository.save(verification);
    }

    const event: DeliveryVerifiedEvent = {
      orderId: verification.orderId,
      courierId: verification.verifiedBy,
      verificationId: verification.id,
      status: 'SUCCESS',
      verifiedAt: verification.verifiedAt.toISOString(),
    };

    /**
     * Nombre del evento:
     * Usá el mismo string que escucha Package Service con @EventPattern().
     *
     * Ejemplo en Package:
     * @EventPattern('delivery.verified')
     */
    await firstValueFrom(this.redisClient.emit('delivery.verified', event));

    return event;
  }
}
