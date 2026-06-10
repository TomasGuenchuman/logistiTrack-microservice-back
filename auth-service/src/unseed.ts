import { In } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from '@/app.module';
import { User } from './users/user.entity';

async function bootstrap() {
  // creo un contexto de NestJS porque no conviene levantar toda la app
  // con HTTP para correr un seed (lo que evita exponer endpoints),
  // pero necesito acceso a los repositorios de TypeORM
  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepository = app.get(getRepositoryToken(User));

  // Verifico si no hay usuarios, para no eliminar si no hay nada, y aviso
  const count = await userRepository.count();
  if (count === 0) {
    console.log('No hay usuarios para eliminar');
    await app.close();
    return;
  }

  await userRepository.delete({
    email: In([
      'usuario@logistitrack.com',
      'courier@logistitrack.com',
      'ejemplo@logistitrack.com',
      'prueba@logistitrack.com',
      'test@logistitrack.com',
    ]),
  });

  console.log(`Unseed de usuarios ejecutado: ${count} usuarios eliminados`);

  await app.close();
}

bootstrap();
