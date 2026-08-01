import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env';
import { logger } from './config/logger';
import { rateLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import router from './routes';

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for dev
  credentials: true,
}));

// Request Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP log interceptor
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Apply rate limiting to all requests
app.use(rateLimiter);

// API Documentation Endpoint
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Base API Router
app.use('/api/v1', router);

// Global Error Handler
app.use(errorHandler);

export default app;
