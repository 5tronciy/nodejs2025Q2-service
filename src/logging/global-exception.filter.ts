import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from './logging.service';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.name;
      } else if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        error = (exceptionResponse as any).error || exception.name;
      } else {
        message = exception.message;
        error = exception.name;
      }
    } else {
      // Unexpected error - always return 500
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      error = 'Internal Server Error';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
    };

    // Log the error with full details
    const errorDetails = {
      url: request.url,
      method: request.method,
      query: request.query,
      body: request.body,
      headers: request.headers,
      userAgent: request.headers['user-agent'],
      ip: request.ip || request.connection.remoteAddress,
      statusCode: status,
      errorMessage: message,
      stack: exception instanceof Error ? exception.stack : undefined,
    };

    this.loggingService.error(
      `${request.method} ${request.url} - ${status} ${message}`,
      exception instanceof Error ? exception.stack : undefined,
      'ExceptionFilter',
      errorDetails,
    );

    response.status(status).json(errorResponse);
  }
}
