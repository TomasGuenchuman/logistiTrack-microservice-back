import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUz...',
    description: 'El refresh token de 7 días',
  })
  @IsString()
  @IsNotEmpty()
  refresh_token!: string;
}