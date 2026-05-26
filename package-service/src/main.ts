import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de las opciones de Swagger
  const config = new DocumentBuilder()
    .setTitle('Mi API de NestJS')
    .setDescription('Descripción de los endpoints')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // ¡AQUÍ SE DEFINE LA RUTA!
  // El primer argumento ('api') es el prefijo de la URL
  SwaggerModule.setup('api', app, document);

  app.connectMicroservice({
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`package-service HTTP running on http://localhost:${port}`);
  console.log(`package-service listening Redis events`);
}

bootstrap();
