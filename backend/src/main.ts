import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

// Load environment variables from the corresponding file
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
