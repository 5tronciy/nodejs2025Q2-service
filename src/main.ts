import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import { ProcessListeners } from './logging/process-listeners';
import * as dotenv from 'dotenv';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

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

  const reflector = app.get(Reflector);

  await app.useGlobalGuards(new JwtAuthGuard(reflector));

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
