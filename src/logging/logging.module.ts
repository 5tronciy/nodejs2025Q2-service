import { Module, Global } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { LoggingInterceptor } from './logging.interceptor';
import { GlobalExceptionFilter } from './global-exception.filter';

@Global()
@Module({
  providers: [LoggingService, LoggingInterceptor, GlobalExceptionFilter],
  exports: [LoggingService, LoggingInterceptor, GlobalExceptionFilter],
})
export class LoggingModule {}
