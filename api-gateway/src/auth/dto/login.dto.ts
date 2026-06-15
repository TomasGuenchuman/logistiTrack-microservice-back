import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'repartidor@ejemplo.com',
    description: 'El correo del repartidor',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'La contraseña',
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}