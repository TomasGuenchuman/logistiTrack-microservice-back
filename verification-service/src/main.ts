import { NestFactory } from '@nestjs/core';
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

  // ¡Aquí se define la ruta!
  // El primer argumento ('api') es el prefijo de la URL
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`verification-service HTTP running on http://localhost:${port}`);
  console.log(`verification-service EMIT Redis events`);
}
bootstrap();
