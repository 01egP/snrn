import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: true, // This allows all origins, use with caution
  });
  app.setGlobalPrefix('api');

  // Global validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Automatic input data transformation
      whitelist: true, // Remove unauthorized fields
      forbidNonWhitelisted: true, // Error on unauthorized fields
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('REST API for SNRN backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
