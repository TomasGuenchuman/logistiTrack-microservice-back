import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // habilito los cors para no tener bloqueos de seguridad cruzada
  app.enableCors({
    origin: '*', // Permite que cualquier dispositivo se conecte (ideal para desarrollo local)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('LogistiTrack API Gateway')
    .setDescription('API Gateway documentation for LogistiTrack microservices')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`API Gateway corriendo en el puerto: ${port}`);
  console.log(`Documentación Swagger disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();
