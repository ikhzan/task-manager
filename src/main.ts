import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
  import * as cors from 'cors';

async function bootstrap() {
 const app = await NestFactory.create(AppModule);
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());

 app.enableCors({
  origin: '*', // Allow all origins (adjust for security later)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});



  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('API for managing tasks')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // await app.listen(3000);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
