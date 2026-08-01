import app from './app';
import { env } from './config/env';
import { prisma } from './config/db';
import { logger } from './config/logger';

const startServer = async () => {
  try {
    // Validate database connection
    await prisma.$connect();
    logger.info('Database connection established successfully.');

    const server = app.listen(env.PORT, () => {
      logger.info(`Server is running in ${env.NODE_ENV} mode on http://localhost:${env.PORT}`);
      logger.info(`API Docs available at http://localhost:${env.PORT}/api-docs`);
    });

    const shutdown = async () => {
      logger.info('Shutting down server gracefully...');
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database connections released. Exit successful.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error: any) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle Uncaught Exceptions
process.on('uncaughtException', (error) => {
  logger.error(`Uncaught Exception: ${error.message} - Stack: ${error.stack}`);
  process.exit(1);
});

// Handle Unhandled Rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error(`Unhandled Rejection: ${reason?.message || reason}`);
  process.exit(1);
});

startServer();
