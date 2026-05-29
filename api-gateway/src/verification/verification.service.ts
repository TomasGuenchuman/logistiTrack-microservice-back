// src/verifications/verification-gateway.service.ts

import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { CreateVerificationDto } from './dto/create-verification.dto';
import { UpdateVerificationDto } from './dto/update-verification.dto';
import { UpdateVerificationStatusDto } from './dto/update-verification-status.dto';

@Injectable()
export class VerificationService {
  private readonly verificationServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('VERIFICATION_SERVICE_URL');

    if (!url) {
      throw new Error('VERIFICATION_SERVICE_URL is not defined');
    }

    this.verificationServiceUrl = url;
  }

  async create(createVerificationDto: CreateVerificationDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.verificationServiceUrl}/verifications`,
          createVerificationDto,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async findAll() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.verificationServiceUrl}/verifications`),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async findByOrder(orderId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.verificationServiceUrl}/verifications/order/${orderId}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async findOne(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.verificationServiceUrl}/verifications/${id}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async update(id: string, updateVerificationDto: UpdateVerificationDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.verificationServiceUrl}/verifications/${id}`,
          updateVerificationDto,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async updateStatus(
    id: string,
    updateVerificationStatusDto: UpdateVerificationStatusDto,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.verificationServiceUrl}/verifications/${id}/status`,
          updateVerificationStatusDto,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async emitDeliveryVerified(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.verificationServiceUrl}/verifications/${id}/emit-delivery-verified`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async remove(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.delete(
          `${this.verificationServiceUrl}/verifications/${id}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  private handleHttpError(error: unknown): never {
    const axiosError = error as AxiosError<any>;

    if (axiosError.response) {
      const status = axiosError.response.status;
      const message =
        axiosError.response.data?.message ||
        axiosError.response.data ||
        'Error from verification service';

      if (status === 404) {
        throw new NotFoundException(message);
      }

      throw new BadGatewayException({
        message: 'Verification service error',
        statusCode: status,
        details: message,
      });
    }

    throw new BadGatewayException(
      'Verification service is unavailable or not responding',
    );
  }
}
