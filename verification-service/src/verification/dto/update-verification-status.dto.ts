import { IsEnum, IsNotEmpty } from 'class-validator';

import { VerificationStatus } from '../entities/verification.entity';

export class UpdateVerificationStatusDto {
  @IsEnum(VerificationStatus, {
    message: 'status debe ser SUCCESS o FAILED',
  })
  @IsNotEmpty({
    message: 'status es obligatorio',
  })
  status!: VerificationStatus;
}
