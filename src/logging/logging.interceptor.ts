import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const { method, url, query, body, headers } = request;
    const userAgent = headers['user-agent'];
    const ip = request.ip || request.connection.remoteAddress;

    // Log the incoming request
    this.loggingService.logRequest(method, url, query, body, userAgent, ip);

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - now;
          this.loggingService.logResponse(
            method,
            url,
            response.statusCode,
            duration,
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          const statusCode = error.status || 500;
          this.loggingService.logResponse(method, url, statusCode, duration);
        },
      }),
    );
  }
}
