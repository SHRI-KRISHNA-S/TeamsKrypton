import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'College Club & Community Management Portal API',
      version: '1.0.0',
      description: 'Core backend API foundation documenting authorization guards, user session handlers, and health reports.',
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}/api/v1`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your access token in the format: Bearer <token>'
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'], // support both ts (dev) and js (production) locations
};

export const swaggerSpec = swaggerJSDoc(options);
