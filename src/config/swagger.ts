import swaggerJsdoc from 'swagger-jsdoc';
import type { Options } from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { CommonSchemas } from '@/types/schemas.js';
import { generateOpenApiSpec } from '@/swagger/index.js';

// Load environment variables
dotenv.config();

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
        email: 'yousif.abozid@yahoo.com',
        url: 'https://github.com/YousifAbozid/template-express-ts',
      },
    },
    servers: [
      {
        url:
          process.env.NODE_ENV === 'production'
            ? process.env.API_URL || 'https://api.example.com'
            : `http://localhost:${process.env.PORT || 5000}`,
        description:
          process.env.NODE_ENV === 'production'
            ? 'Production server'
            : 'Development server',
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
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts', './src/types/schemas.ts'],
};

// Generate the traditional swagger spec
const swaggerSpec = swaggerJsdoc(options) as any;

// Generate the enhanced OpenAPI spec from our decorators
const controllers: any[] = []; // Add your controllers here
const enhancedSpec = generateOpenApiSpec(controllers);

// Merge both specs, prioritizing enhanced spec for paths and components
const mergedSpec = {
  ...swaggerSpec,
  ...enhancedSpec,
  paths: {
    ...swaggerSpec.paths,
    ...enhancedSpec.paths,
  },
  components: {
    ...swaggerSpec.components,
    schemas: {
      ...swaggerSpec.components?.schemas,
      ...enhancedSpec.components.schemas,
    },
    securitySchemes: {
      ...swaggerSpec.components?.securitySchemes,
      ...enhancedSpec.components.securitySchemes,
    },
    parameters: {
      ...swaggerSpec.components?.parameters,
      ...enhancedSpec.components.parameters,
    },
    responses: {
      ...swaggerSpec.components?.responses,
      ...enhancedSpec.components.responses,
    },
  },
  tags: [...(swaggerSpec.tags || []), ...(enhancedSpec.tags || [])],
};

export default mergedSpec;
