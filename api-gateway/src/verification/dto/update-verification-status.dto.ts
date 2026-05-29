import { IsEnum, IsNotEmpty } from 'class-validator';

import { VerificationStatus } from './VerificationStatus.enum';

export class UpdateVerificationStatusDto {
  @IsEnum(VerificationStatus, {
    message: 'status debe ser SUCCESS o FAILED',
  })
  @IsNotEmpty({
    message: 'status es obligatorio',
  })
  status!: VerificationStatus;
}
