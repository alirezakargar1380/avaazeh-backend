require('dotenv').config({ path: '.env' })
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, authorization',
    credentials: true,
    preflightContinue: false,
    // optionsSuccessStatus: 204
  };
  
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors(corsOptions);

  await app.listen(Number(process.env.PORT))
}
bootstrap();
