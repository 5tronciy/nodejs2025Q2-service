import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  context?: string;
  trace?: string;
  metadata?: any;
}

@Injectable()
export class LoggingService {
  private readonly logLevel: LogLevel;
  private readonly logToFile: boolean;
  private readonly logDirectory: string;
  private readonly maxFileSize: number;
  private currentLogFile: string;

  constructor(private readonly configService: ConfigService) {
    this.logLevel = this.parseLogLevel(
      this.configService.get('LOG_LEVEL', 'INFO'),
    );
    this.logToFile = this.configService.get('LOG_TO_FILE', 'true') === 'true';
    this.logDirectory = this.configService.get('LOG_DIRECTORY', './logs');
    this.maxFileSize = parseInt(
      this.configService.get('LOG_MAX_FILE_SIZE_KB', '1024'),
      10,
    );

    if (this.logToFile) {
      this.ensureLogDirectory();
      this.currentLogFile = this.generateLogFileName();
    }
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return LogLevel.ERROR;
      case 'WARN':
        return LogLevel.WARN;
      case 'INFO':
        return LogLevel.INFO;
      case 'DEBUG':
        return LogLevel.DEBUG;
      default:
        return LogLevel.INFO;
    }
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDirectory)) {
      fs.mkdirSync(this.logDirectory, { recursive: true });
    }
  }

  private generateLogFileName(): string {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0];
    return path.join(this.logDirectory, `app-${timestamp}.log`);
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.logLevel;
  }

  private formatLogEntry(entry: LogEntry): string {
    const baseLog = `[${entry.timestamp}] [${entry.level}]${
      entry.context ? ` [${entry.context}]` : ''
    } ${entry.message}`;

    if (entry.metadata) {
      return `${baseLog} ${JSON.stringify(entry.metadata)}`;
    }

    if (entry.trace) {
      return `${baseLog}\n${entry.trace}`;
    }

    return baseLog;
  }

  private async writeToFile(logEntry: string): Promise<void> {
    if (!this.logToFile) return;

    try {
      if (fs.existsSync(this.currentLogFile)) {
        const stats = fs.statSync(this.currentLogFile);
        const fileSizeKB = stats.size / 1024;

        if (fileSizeKB >= this.maxFileSize) {
          await this.rotateLogFile();
        }
      }

      await fs.promises.appendFile(this.currentLogFile, logEntry + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
      console.log(logEntry);
    }
  }

  private async rotateLogFile(): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const rotatedFileName = this.currentLogFile.replace(
      '.log',
      `-${timestamp}.log`,
    );

    try {
      await fs.promises.rename(this.currentLogFile, rotatedFileName);
      this.currentLogFile = this.generateLogFileName();
    } catch (error) {
      console.error('Failed to rotate log file:', error);
    }
  }

  private async log(
    level: LogLevel,
    levelName: string,
    message: string,
    context?: string,
    trace?: string,
    metadata?: any,
  ): Promise<void> {
    if (!this.shouldLog(level)) return;

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      message,
      context,
      trace,
      metadata,
    };

    const formattedLog = this.formatLogEntry(logEntry);

    console.log(formattedLog);

    await this.writeToFile(formattedLog);
  }

  async error(
    message: string,
    trace?: string,
    context?: string,
    metadata?: any,
  ): Promise<void> {
    await this.log(LogLevel.ERROR, 'ERROR', message, context, trace, metadata);
  }

  async warn(message: string, context?: string, metadata?: any): Promise<void> {
    await this.log(
      LogLevel.WARN,
      'WARN',
      message,
      context,
      undefined,
      metadata,
    );
  }

  async info(message: string, context?: string, metadata?: any): Promise<void> {
    await this.log(
      LogLevel.INFO,
      'INFO',
      message,
      context,
      undefined,
      metadata,
    );
  }

  async debug(
    message: string,
    context?: string,
    metadata?: any,
  ): Promise<void> {
    await this.log(
      LogLevel.DEBUG,
      'DEBUG',
      message,
      context,
      undefined,
      metadata,
    );
  }

  async logRequest(
    method: string,
    url: string,
    query: any,
    body: any,
    userAgent?: string,
    ip?: string,
  ): Promise<void> {
    const metadata = {
      method,
      url,
      query,
      body: body ? JSON.stringify(body) : undefined,
      userAgent,
      ip,
    };

    await this.info(`Incoming ${method} request to ${url}`, 'HTTP', metadata);
  }

  async logResponse(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
  ): Promise<void> {
    const metadata = {
      method,
      url,
      statusCode,
      duration: `${duration}ms`,
    };

    const level = statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    const levelName = statusCode >= 400 ? 'ERROR' : 'INFO';

    await this.log(
      level,
      levelName,
      `${method} ${url} ${statusCode} - ${duration}ms`,
      'HTTP',
      undefined,
      metadata,
    );
  }
}
