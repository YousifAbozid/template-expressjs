import swaggerJsdoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';
import { CommonSchemas } from '@/types/schemas.js';

const options: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API',
      version: '1.0.0',
      description:
        'A modern Express.js API template with TypeScript and OpenAPI',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        ...CommonSchemas,
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for authentication',
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error400' },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error404' },
            },
          },
        },
        InternalError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error500' },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      // Add more tags as you add features
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts', './src/types/schemas.ts'],
};

const specs = swaggerJsdoc(options);

export default specs;
