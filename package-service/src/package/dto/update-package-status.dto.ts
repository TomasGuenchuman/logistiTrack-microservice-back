import { IsEnum, IsNotEmpty } from 'class-validator';
import { PackageStatus } from '../entities/package.entity';

export class UpdatePackageStatusDto {
  @IsNotEmpty()
  @IsEnum(PackageStatus)
  status!: PackageStatus;
}
