import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  // 1. Levantamos un contexto de NestJS sin abrir puertos HTTP
  const app = await NestFactory.createApplicationContext(AppModule);
  
  // 2. Pedimos prestado el repositorio de tu entidad User
  const userRepository = app.get(getRepositoryToken(User));

  const emailPrueba = 'repartidor@ejemplo.com';

  // 3. Verificamos que no exista para no duplicarlo si corrés el comando dos veces
  const userExists = await userRepository.findOneBy({ email: emailPrueba });

  if (!userExists) {
    // 4. Encriptamos la contraseña tal cual lo hace tu lógica de registro real
    const hashedPassword = await bcrypt.hash('123456', 10);

    // 5. Creamos y guardamos el usuario
    const newUser = userRepository.create({
      email: emailPrueba,
      password: hashedPassword,
      // Si tu entidad User tiene campos obligatorios extra (ej: nombre, rol), agregalos acá
    });

    await userRepository.save(newUser);
    console.log('✅ Seeder: Usuario repartidor creado con éxito en PostgreSQL');
  } else {
    console.log('⚠️ Seeder: El usuario ya existía en la base de datos');
  }

  // 6. Apagamos el motor
  await app.close();
}

bootstrap();