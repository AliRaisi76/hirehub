import 'dotenv/config';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { connectDB, disconnectDB } from './config/prisma.js';
import { promisify } from 'util';

process.on('uncaughtException', (err: Error) => {
  logger.fatal({ err }, 'Uncaught exception. Shutting down...');
  process.exit(1);
});

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal({ err: reason }, 'Unhandled rejection. Shutting down...');
  process.exit(1);
});

const startServer = async (): Promise<void> => {
  await connectDB();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });

  // flag for safe shut down
  let isShuttingDown = false;
  const shutdown = async (signal: string): Promise<void> => {
    // Safe shut down. Prevent double shutdown(ctrl+c)
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;

    logger.info(`${signal} received. Shutting down...`);

    try {
      await promisify(server.close.bind(server))();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      logger.error({ err }, 'Error during shutdown');
      process.exit(1);
    }
  };

  // Server Runtime error handling
  server.on('error', (err) => {
    logger.error({ err }, 'Server encountered a runtime error');
    void shutdown('SERVER_ERROR');
  });

  // Signal catching, Graceful shutdown
  process.on('SIGINT', () => {
    void shutdown('SIGINT');
  });

  // Signal catching, Graceful shutdown
  process.on('SIGTERM', () => {
    void shutdown('SIGTERM');
  });
};

startServer().catch((err) => {
  logger.fatal({ err }, `Failed to start application.`);
  process.exit(1);
});
