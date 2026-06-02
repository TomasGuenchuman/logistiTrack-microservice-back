import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LogoutDto {
  @ApiProperty({
    example: '1',
    description: 'El ID del usuario (repartidor) que cierra sesión',
  })
  @IsNotEmpty()
  userId!: string;
}