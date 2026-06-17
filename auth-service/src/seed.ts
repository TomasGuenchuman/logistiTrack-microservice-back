import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  // Levantamos un contexto de NestJS sin abrir puertos HTTP
  const app = await NestFactory.createApplicationContext(AppModule);

  // Pedimos prestado el repositorio de tu entidad User
  const userRepository = app.get(getRepositoryToken(User));

  // Evito generar usuarios duplicados
  const count = await userRepository.count();

  if (count > 0) {
    console.log('Ya existen usuarios, no se generarán nuevos');
    await app.close();
    return;
  }

  const defaultPassword = await bcrypt.hash('Password123', 10);

  const users: Partial<User>[] = [
    // 4 paquetes asignados
    {
      email: 'courier@logistitrack.com',
      password: defaultPassword,
    },
    // 3 paquetes asignados
    {
      email: 'ejemplo@logistitrack.com',
      password: defaultPassword,
    },
    // 3 paquetes asignados
    {
      email: 'prueba@logistitrack.com',
      password: defaultPassword,
    },
    // 0 paquetes asignados
    {
      email: 'test@logistitrack.com',
      password: defaultPassword,
    },
    // 0 paquetes asignados
    {
      email: 'usuario@logistitrack.com',
      password: defaultPassword,
    },
  ];

  await userRepository.save(users);

  console.log(`Seed de usuarios completado: ${users.length} usuarios creados`);

  // Apagamos el motor
  await app.close();
}

bootstrap();
