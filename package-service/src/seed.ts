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
    // 4 Paquetes de user: courier@logistitrack.com
    {
      trackingCode: 'PKG-001-QR',
      recipientName: 'Lionel Scaloni',
      recipientDocument: '13131313',
      address: 'Gobernador Paz 13',
      status: PackageStatus.PENDING,
      addressDetail: 'Piso 2 Depto. 3',
      courierId: '387bb38c-7c58-4e81-a0b2-bcf6cb7b0428',
    },
    {
      trackingCode: 'PKG-002-QR',
      recipientName: 'Carlos López',
      recipientDocument: '32123456',
      address: '12 de Octubre 12',
      status: PackageStatus.PENDING,
      addressDetail: 'Piso 2 Depto. 3',
      courierId: '387bb38c-7c58-4e81-a0b2-bcf6cb7b0428',
    },
    {
      trackingCode: 'PKG-003-QR',
      recipientName: 'Emiliano Martínez',
      recipientDocument: '23232323',
      address: 'Tolhuin 23',
      status: PackageStatus.IN_TRANSIT,
      addressDetail: 'Casa 23',
      courierId: '387bb38c-7c58-4e81-a0b2-bcf6cb7b0428',
    },
    {
      trackingCode: 'PKG-004-QR',
      recipientName: 'Lionel Messi',
      recipientDocument: '10101010',
      address: 'Rio Grande 10',
      status: PackageStatus.DELIVERED,
      courierId: '387bb38c-7c58-4e81-a0b2-bcf6cb7b0428',
      deliveredAt: new Date(),
    },

    // 3 Paquetes de user: ejemplo@logistitrack.com

    {
      trackingCode: 'PKG-005-QR',
      recipientName: 'Julián Álvarez',
      recipientDocument: '99999999',
      address: 'Maipú 9',
      status: PackageStatus.PENDING,
      addressDetail: 'Casa 5 - Color azul',
      courierId: '468855e9-58c3-4b98-af2b-dac0afc680b1',
    },
    {
      trackingCode: 'PKG-006-QR',
      recipientName: 'Sofía Díaz',
      recipientDocument: '36666333',
      address: 'Marcos Vera 100',
      status: PackageStatus.PENDING,
      addressDetail: 'Piso 3 - Depto. 8',
      courierId: '468855e9-58c3-4b98-af2b-dac0afc680b1',
    },
    {
      trackingCode: 'PKG-007-QR',
      recipientName: 'Leonel Ssime',
      recipientDocument: '10100101',
      address: 'Maipú 100',
      status: PackageStatus.DELIVERED,
      courierId: '468855e9-58c3-4b98-af2b-dac0afc680b1',
      deliveredAt: new Date(),
    },

    // 3 Paquetes de user: prueba@logistitrack.com

    {
      trackingCode: 'PKG-008-QR',
      recipientName: 'Pedro Sánchez',
      recipientDocument: '29999111',
      address: 'Gobernador Campos 20',
      status: PackageStatus.PENDING,
      courierId: '391fa1ea-c87e-4b01-8795-f12b4b07a3fb',
    },
    {
      trackingCode: 'PKG-009-QR',
      recipientName: 'Lucía Castro',
      recipientDocument: '37777222',
      address: 'Perón Norte 100',
      status: PackageStatus.PENDING,
      courierId: '391fa1ea-c87e-4b01-8795-f12b4b07a3fb',
    },
    {
      trackingCode: 'PKG-010-QR',
      recipientName: 'Alexis Mac Allister',
      recipientDocument: '18181818',
      address: 'San Martín 18',
      status: PackageStatus.DELIVERED,
      addressDetail: 'Piso 2 - Depto. 5',
      courierId: '391fa1ea-c87e-4b01-8795-f12b4b07a3fb',
      deliveredAt: new Date(),
    },

    // 6 paquetes sin repartidor asignado
    {
      trackingCode: 'PKG-011-QR',
      recipientName: 'Ana Rodríguez',
      recipientDocument: '33444555',
      address: 'Perón Sur 100',
      status: PackageStatus.PENDING,
      addressDetail: 'Mansión 10',
      courierId: null,
      deliveredAt: new Date(),
    },
    {
      trackingCode: 'PKG-012-QR',
      recipientName: 'María Gómez',
      recipientDocument: '28999888',
      address: 'San Martín 456',
      status: PackageStatus.PENDING,
      addressDetail: '',
      courierId: null,
      deliveredAt: new Date(),
    },
    {
      trackingCode: 'PKG-013-QR',
      recipientName: 'Miguel Torres',
      recipientDocument: '35555444',
      address: 'San Martín 200',
      status: PackageStatus.PENDING,
      addressDetail: '',
      courierId: null,
      deliveredAt: new Date(),
    },
    {
      trackingCode: 'PKG-014-QR',
      recipientName: 'Laura Fernández',
      recipientDocument: '27888777',
      address: 'Magallanes 300',
      status: PackageStatus.PENDING,
      addressDetail: '',
      courierId: null,
      deliveredAt: new Date(),
    },
    {
      trackingCode: 'PKG-015-QR',
      recipientName: 'Cristian Romero',
      recipientDocument: '77777777',
      address: 'Maipú 7',
      status: PackageStatus.PENDING,
      addressDetail: '',
      courierId: null,
      deliveredAt: new Date(),
    },
    {
      trackingCode: 'PKG-016-QR',
      recipientName: 'Diego Romero',
      recipientDocument: '38888111',
      address: 'Beauvoir 100',
      status: PackageStatus.PENDING,
      addressDetail: '',
      courierId: null,
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
