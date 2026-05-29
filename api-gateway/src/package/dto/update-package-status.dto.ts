import { IsEnum, IsNotEmpty } from 'class-validator';
import { PackageStatus } from './package-status.enum';

export class UpdatePackageStatusDto {
  @IsNotEmpty()
  @IsEnum(PackageStatus)
  status!: PackageStatus;
}
