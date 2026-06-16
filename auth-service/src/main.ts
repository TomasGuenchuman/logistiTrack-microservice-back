import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ignoro datos que no esten en el dto
    forbidNonWhitelisted: true, // lanzo errores si intentan inyectar campos raros
  }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('LogistiTrack Auth Service')
    .setDescription('Documentación del microservicio de autenticación')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`Auth Service corriendo en el puerto: ${port}`);
  console.log(`Swagger disponible en: http://localhost:${port}/api/docs`);
}
bootstrap();
