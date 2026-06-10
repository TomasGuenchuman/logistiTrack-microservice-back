import { In } from 'typeorm';

import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from '@/app.module';
import { Package, PackageStatus } from '@/package/entities/package.entity';

async function bootstrap() {
  // creo un contexto de NestJS porque no conviene levantar toda la app
  // con HTTP para correr un seed (lo que evita exponer endpoints),
  // pero necesito acceso a los repositorios de TypeORM
  const app = await NestFactory.createApplicationContext(AppModule);

  const packageRepository = app.get(getRepositoryToken(Package));

  // Verifico si no hay paquetes, para no eliminar
  // si no hay nada, y lo aviso
  const count = await packageRepository.count();
  if (count === 0) {
    console.log('No hay paquetes para eliminar');
    await app.close();
    return;
  }

  await packageRepository.delete({
    trackingCode: In([
      'PKG-001-QR',
      'PKG-002-QR',
      'PKG-003-QR',
      'PKG-004-QR',
      'PKG-005-QR',
      'PKG-006-QR',
      'PKG-007-QR',
      'PKG-008-QR',
      'PKG-009-QR',
      'PKG-010-QR',
    ]),
  });

  console.log(`Unseed de paquetes ejecutado: ${count} paquetes eliminados`);

  await app.close();
}

bootstrap();
