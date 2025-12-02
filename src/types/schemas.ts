/**
 * OpenAPI Schema Definitions
 * These types are used for OpenAPI documentation and type generation
 */

export interface HealthCheckSchema {
  status: 'ok' | 'error';
  uptime: number;
  timestamp: string;
  environment: string;
}

export interface ErrorSchema {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface SuccessSchema<T = any> {
  success: true;
  message: string;
  data?: T;
}

// Example schemas for common API responses
export const CommonSchemas = {
  Error400: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Bad Request' },
      errors: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string', example: 'email' },
            message: { type: 'string', example: 'Invalid email format' },
          },
        },
      },
    },
  },
  Error404: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Resource not found' },
    },
  },
  Error500: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      message: { type: 'string', example: 'Internal server error' },
    },
  },
  HealthCheck: {
    type: 'object',
    properties: {
      status: { type: 'string', example: 'ok' },
      uptime: { type: 'number', example: 123.45 },
      timestamp: { type: 'string', example: '2025-12-02T10:30:00.000Z' },
      environment: { type: 'string', example: 'development' },
    },
  },
} as const;
