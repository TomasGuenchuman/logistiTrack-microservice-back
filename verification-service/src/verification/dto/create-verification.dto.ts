import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  IsDateString,
} from 'class-validator';

import { VerificationStatus } from '../entities/verification.entity';

import { ApiProperty } from '@nestjs/swagger';

export class CreateVerificationDto {
  @IsUUID('4', {
    message: 'orderId debe ser un UUID válido',
  })
  @IsNotEmpty({
    message: 'orderId es obligatorio',
  })
  orderId!: string;

  @IsString({
    message: 'qrHash debe ser un string',
  })
  @IsNotEmpty({
    message: 'qrHash es obligatorio',
  })
  qrHash!: string;

  @IsString({
    message: 'signatureData debe ser un string',
  })
  @IsNotEmpty({
    message: 'signatureData es obligatorio',
  })
  signatureData!: string;

  @IsUUID('4', {
    message: 'verifiedBy debe ser un UUID válido',
  })
  @IsNotEmpty({
    message: 'verifiedBy es obligatorio',
  })
  verifiedBy!: string;

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
    nullable: true, // Indica a Swagger que acepta null
    required: false, // Lo marca como opcional en Swagger
  })
  @IsOptional()
  @IsDateString(
    {},
    {
      message: 'verifiedAt debe ser una fecha ISO válida',
    },
  )
  verifiedAt?: string | null;
}
