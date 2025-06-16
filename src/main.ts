import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import { ProcessListeners } from './logging/process-listeners';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggingService = app.get(LoggingService);

  ProcessListeners.initialize(loggingService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;

  await app.listen(port);

  await loggingService.info(
    `Application is running on: http://localhost:${port}`,
    'Bootstrap',
    { port, environment: process.env.NODE_ENV || 'development' },
  );

  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch(async (error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
