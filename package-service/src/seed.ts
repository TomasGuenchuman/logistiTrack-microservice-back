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

  // Verifico si ya hay paquetes para no crear duplicados
  // cada vez que corro el seed
  const count = await packageRepository.count();
  if (count > 0) {
    console.log('Ya existen paquetes, no se generarán nuevos');
    await app.close();
    return;
  }

  // Uso Partial<Package> para no tener que llenar todos los
  // campos, usando su autogeneración (ej: id, createdAt, updatedAt)
  const packages: Partial<Package>[] = [
    {
      trackingCode: 'PKG-001',
      recipientName: 'Juan Pérez',
      recipientDocument: '30111222',
      address: 'Av. Corrientes 1234',
      status: PackageStatus.PENDING,
      addressDetail: 'Piso 2 Depto. 3',
    },
    {
      trackingCode: 'PKG-002',
      recipientName: 'María Gómez',
      recipientDocument: '28999888',
      address: 'San Martín 456',
      status: PackageStatus.PENDING,
      addressDetail: 'Casa 10',
    },
    {
      trackingCode: 'PKG-003',
      recipientName: 'Carlos López',
      recipientDocument: '32123456',
      address: 'Belgrano 789',
      status: PackageStatus.IN_TRANSIT,
      addressDetail: 'Piso 2 Depto. 3',
      courierId: '11111111-1111-1111-1111-111111111111',
    },
    {
      trackingCode: 'PKG-004',
      recipientName: 'Ana Rodríguez',
      recipientDocument: '33444555',
      address: 'Mitre 101',
      status: PackageStatus.IN_TRANSIT,
      courierId: '11111111-1111-1111-1111-111111111111',
    },
    {
      trackingCode: 'PKG-005',
      recipientName: 'Pedro Sánchez',
      recipientDocument: '29999111',
      address: 'Rivadavia 202',
      status: PackageStatus.DELIVERED,
      courierId: '11111111-1111-1111-1111-111111111111',
      deliveredAt: new Date(),
    },
    {
      trackingCode: 'PKG-006',
      recipientName: 'Laura Fernández',
      recipientDocument: '27888777',
      address: 'Sarmiento 303',
      status: PackageStatus.DELIVERED,
      addressDetail: 'Piso 2 - Depto. 5',
      courierId: '22222222-2222-2222-2222-222222222222',
      deliveredAt: new Date(),
    },
    {
      trackingCode: 'PKG-007',
      recipientName: 'Miguel Torres',
      recipientDocument: '35555444',
      address: 'Lavalle 404',
      status: PackageStatus.PENDING,
      addressDetail: 'Casa 5 - Color azul',
    },
    {
      trackingCode: 'PKG-008',
      recipientName: 'Sofía Díaz',
      recipientDocument: '36666333',
      address: 'Alsina 505',
      status: PackageStatus.PENDING,
      addressDetail: 'Piso 3 - Depto. 8',
    },
    {
      trackingCode: 'PKG-009',
      recipientName: 'Lucía Castro',
      recipientDocument: '37777222',
      address: 'Pueyrredón 606',
      status: PackageStatus.IN_TRANSIT,
      courierId: '22222222-2222-2222-2222-222222222222',
    },
    {
      trackingCode: 'PKG-010',
      recipientName: 'Diego Romero',
      recipientDocument: '38888111',
      address: 'Callao 707',
      status: PackageStatus.DELIVERED,
      courierId: '22222222-2222-2222-2222-222222222222',
      deliveredAt: new Date(),
    },
  ];

  await packageRepository.save(packages);

  console.log(
    `Seed de paquetes completado: ${packages.length} paquetes creados`,
  );

  await app.close();
}

bootstrap();
