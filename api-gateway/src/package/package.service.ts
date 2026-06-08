import {
  BadGatewayException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';

@Injectable()
export class PackageService {
  private readonly packageServiceUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const url = this.configService.get<string>('PACKAGE_SERVICE_URL');
    if (!url) {
      throw new Error('PACKAGE_SERVICE_URL is not defined');
    }

    this.packageServiceUrl = url;
  }

  async create(createPackageDto: CreatePackageDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.packageServiceUrl}/packages`,
          createPackageDto,
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
        this.httpService.get(`${this.packageServiceUrl}/packages`),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async findOne(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.packageServiceUrl}/packages/${id}`),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async findByTrackingCode(trackingCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.packageServiceUrl}/packages/tracking/${trackingCode}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async findByCourierId(courierId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.packageServiceUrl}/packages/courier/${courierId}`,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async update(id: string, updatePackageDto: UpdatePackageDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.packageServiceUrl}/packages/${id}`,
          updatePackageDto,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async updateStatus(
    id: string,
    updatePackageStatusDto: UpdatePackageStatusDto,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.packageServiceUrl}/packages/${id}/status`,
          updatePackageStatusDto,
        ),
      );

      return response.data;
    } catch (error) {
      this.handleHttpError(error);
    }
  }

  async markAsDelivered(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(
          `${this.packageServiceUrl}/packages/${id}/delivered`,
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
        this.httpService.delete(`${this.packageServiceUrl}/packages/${id}`),
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
        axiosError.response.data?.message ??
        axiosError.response.data ??
        'Error from package-service';

      if (status === 404) {
        throw new NotFoundException(message);
      }

      throw new BadGatewayException({
        message: 'Error communicating with package-service',
        packageServiceStatusCode: status,
        packageServiceMessage: message,
      });
    }

    throw new BadGatewayException(
      'package-service is not available or did not respond',
    );
  }
}
