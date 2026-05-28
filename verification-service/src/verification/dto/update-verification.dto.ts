import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

import { VerificationStatus } from '../entities/verification.entity';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateVerificationDto {
  @IsOptional()
  @IsUUID('4', {
    message: 'orderId debe ser un UUID válido',
  })
  orderId?: string;

  @IsOptional()
  @IsString({
    message: 'qrHash debe ser un string',
  })
  qrHash?: string;

  @IsOptional()
  @IsString({
    message: 'signatureData debe ser un string',
  })
  signatureData?: string;

  @IsOptional()
  @IsUUID('4', {
    message: 'verifiedBy debe ser un UUID válido',
  })
  verifiedBy?: string;

  @IsOptional()
  @IsEnum(VerificationStatus, {
    message: 'status debe ser SUCCESS o FAILED',
  })
  status?: VerificationStatus;

  @ApiProperty({
    description: 'Fecha de verificación del registro (Formato ISO 8601)',
    type: String,
    format: 'date-time', // 👈 Muestra string($date-time) en Swagger
    example: '2026-05-28T17:54:00.000Z',
    required: false, // Lo marca como opcional en Swagger
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'verifiedAt debe ser una fecha ISO válida',
    },
  )
  verifiedAt?: string;
}
