import { LoggingService } from './logging.service';

export class ProcessListeners {
  private static loggingService: LoggingService;

  static initialize(loggingService: LoggingService): void {
    ProcessListeners.loggingService = loggingService;
    ProcessListeners.setupListeners();
  }

  private static setupListeners(): void {
    process.on('uncaughtException', (error: Error) => {
      ProcessListeners.loggingService.error(
        `Uncaught Exception: ${error.message}`,
        error.stack,
        'UncaughtException',
        {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      );

      setTimeout(() => {
        console.error('Uncaught Exception - Exiting application');
        process.exit(1);
      }, 1000);
    });

    process.on(
      'unhandledRejection',
      (reason: unknown, promise: Promise<any>) => {
        const errorMessage =
          reason instanceof Error ? reason.message : String(reason);
        const errorStack = reason instanceof Error ? reason.stack : undefined;

        ProcessListeners.loggingService.error(
          `Unhandled Promise Rejection: ${errorMessage}`,
          errorStack,
          'UnhandledRejection',
          {
            reason:
              reason instanceof Error
                ? {
                    name: reason.name,
                    message: reason.message,
                    stack: reason.stack,
                  }
                : reason,
            promise: promise.toString(),
          },
        );

        const exitOnUnhandledRejection =
          process.env.EXIT_ON_UNHANDLED_REJECTION === 'true';

        if (exitOnUnhandledRejection) {
          setTimeout(() => {
            console.error('Unhandled Promise Rejection - Exiting application');
            process.exit(1);
          }, 1000);
        }
      },
    );

    process.on('SIGTERM', () => {
      ProcessListeners.loggingService.info(
        'SIGTERM received - Starting graceful shutdown',
        'ProcessSignal',
      );
    });

    process.on('SIGINT', () => {
      ProcessListeners.loggingService.info(
        'SIGINT received - Starting graceful shutdown',
        'ProcessSignal',
      );
    });

    process.on('exit', (code: number) => {
      console.log(`Process exiting with code: ${code}`);
    });
  }
}
