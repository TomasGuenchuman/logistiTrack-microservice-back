import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Package, PackageStatus } from './entities/package.entity';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { UpdatePackageStatusDto } from './dto/update-package-status.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const packageExists = await this.packageRepository.findOne({
      where: {
        trackingCode: createPackageDto.trackingCode,
      },
    });

    if (packageExists) {
      throw new ConflictException(
        `Ya existe un paquete con el tracking code ${createPackageDto.trackingCode}`,
      );
    }

    const newPackage = this.packageRepository.create(createPackageDto);

    return this.packageRepository.save(newPackage);
  }

  async findAll(): Promise<Package[]> {
    return this.packageRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: string): Promise<Package> {
    const packageFound = await this.packageRepository.findOne({
      where: {
        id,
      },
    });

    if (!packageFound) {
      throw new NotFoundException(`No se encontró el paquete con id ${id}`);
    }

    return packageFound;
  }

  async findByTrackingCode(trackingCode: string): Promise<Package> {
    const packageFound = await this.packageRepository.findOne({
      where: {
        trackingCode,
      },
    });

    if (!packageFound) {
      throw new NotFoundException(
        `No se encontró el paquete con tracking code ${trackingCode}`,
      );
    }

    return packageFound;
  }

  async update(
    id: string,
    updatePackageDto: UpdatePackageDto,
  ): Promise<Package> {
    const packageFound = await this.findOne(id);

    if (
      updatePackageDto.trackingCode &&
      updatePackageDto.trackingCode !== packageFound.trackingCode
    ) {
      const packageWithSameTrackingCode = await this.packageRepository.findOne({
        where: {
          trackingCode: updatePackageDto.trackingCode,
        },
      });

      if (packageWithSameTrackingCode) {
        throw new ConflictException(
          `Ya existe un paquete con el tracking code ${updatePackageDto.trackingCode}`,
        );
      }
    }

    Object.assign(packageFound, updatePackageDto);

    return this.packageRepository.save(packageFound);
  }

  async updateStatus(
    id: string,
    updatePackageStatusDto: UpdatePackageStatusDto,
  ): Promise<Package> {
    const packageFound = await this.findOne(id);

    packageFound.status = updatePackageStatusDto.status;

    return this.packageRepository.save(packageFound);
  }

  async remove(id: string): Promise<void> {
    const packageFound = await this.findOne(id);

    await this.packageRepository.remove(packageFound);
  }

  async findByCourierId(courierId: string): Promise<Package[]> {
    return this.packageRepository.find({
      where: {
        courierId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async markAsDelivered(id: string): Promise<Package> {
    const packageFound = await this.findOne(id);

    if (packageFound.status === PackageStatus.DELIVERED) {
      return packageFound;
    }

    packageFound.status = PackageStatus.DELIVERED;
    packageFound.deliveredAt = new Date();

    return this.packageRepository.save(packageFound);
  }
}
