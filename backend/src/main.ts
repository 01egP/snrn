import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS
  app.enableCors({
    origin: true, // This allows all origins, use with caution
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT);
}
bootstrap();
