import {
  OpenApiSpec,
  OpenApiSchema,
  OpenApiOperation,
  OpenApiResponse,
  OpenApiParameter,
  OpenApiRequestBody,
  extractControllerMetadata,
  generateSchemaFromClass,
} from './schema-generator.js';
import {
  ErrorResponseDto,
  ValidationErrorDto,
  SuccessResponseDto,
  PaginationQueryDto,
} from '@/dto/index.js';

export function generateOpenApiSpec(controllers: any[]): OpenApiSpec {
  const spec: OpenApiSpec = {
    openapi: '3.0.0',
    info: {
      title: 'Express TypeScript API',
      description:
        'A comprehensive Express.js API with TypeScript and OpenAPI documentation',
      version: '1.0.0',
      contact: {
        name: 'API Support',
        email: 'yousif.abozid@yahoo.com',
        url: 'https://github.com/YousifAbozid/template-express-ts',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    paths: {},
    components: {
      schemas: generateComponentSchemas(),
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Bearer token authentication',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key authentication',
        },
      },
      parameters: {
        PageParameter: {
          name: 'page',
          in: 'query',
          description: 'Page number for pagination',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
          },
        },
        LimitParameter: {
          name: 'limit',
          in: 'query',
          description: 'Number of items per page',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponseDto' },
            },
          },
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponseDto' },
            },
          },
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponseDto' },
            },
          },
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponseDto' },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Users',
        description: 'User management operations',
      },
      {
        name: 'Health',
        description: 'API health check endpoints',
      },
    ],
  };

  // Process controllers and build paths
  for (const controller of controllers) {
    const metadata = extractControllerMetadata(controller);

    for (const route of metadata.routes) {
      const fullPath = route.path.replace(/\\/g, '/');
      const normalizedPath = normalizePath(fullPath);

      if (!spec.paths[normalizedPath]) {
        spec.paths[normalizedPath] = {};
      }

      spec.paths[normalizedPath][route.method] = buildOperation(
        route.operation
      );
    }
  }

  return spec;
}

/**
 * Generate component schemas for all DTOs
 */
function generateComponentSchemas(): Record<string, OpenApiSchema> {
  const schemas: Record<string, OpenApiSchema> = {};

  // Add your domain-specific DTOs here
  // Example:
  // schemas.YourResponseDto = generateSchemaFromClass(YourResponseDto);
  // schemas.CreateYourDto = generateSchemaFromClass(CreateYourDto);
  // schemas.UpdateYourDto = generateSchemaFromClass(UpdateYourDto);

  // Common DTOs
  schemas.ErrorResponseDto = generateSchemaFromClass(ErrorResponseDto);
  schemas.ValidationErrorDto = generateSchemaFromClass(ValidationErrorDto);
  schemas.SuccessResponseDto = generateSchemaFromClass(SuccessResponseDto);
  schemas.PaginationQueryDto = generateSchemaFromClass(PaginationQueryDto);

  // Add your domain-specific enums here
  // Example:
  // schemas.YourEnum = {
  //   type: 'string',
  //   enum: Object.values(YourEnum),
  //   description: 'Your enum description'
  // };

  return schemas;
}

/**
 * Build OpenAPI operation from route metadata
 */
function buildOperation(operationMetadata: any): OpenApiOperation {
  const operation: OpenApiOperation = {
    summary: operationMetadata.summary || 'API endpoint',
    description: operationMetadata.description,
    tags: operationMetadata.tags || [],
    responses: {},
  };

  // Add operation ID if available
  if (operationMetadata.operationId) {
    operation.operationId = operationMetadata.operationId;
  }

  // Process responses
  if (operationMetadata.responses && operationMetadata.responses.length > 0) {
    for (const response of operationMetadata.responses) {
      const statusCode = response.status.toString();
      operation.responses[statusCode] = buildResponse(response);
    }
  } else {
    // Default responses
    operation.responses['200'] = {
      description: 'Success',
      content: {
        'application/json': {
          schema: { type: 'object' },
        },
      },
    };
  }

  // Add common error responses
  operation.responses['400'] = {
    $ref: '#/components/responses/BadRequest',
  } as any;
  operation.responses['500'] = {
    $ref: '#/components/responses/InternalServerError',
  } as any;

  // Process parameters
  if (operationMetadata.parameters && operationMetadata.parameters.length > 0) {
    operation.parameters = operationMetadata.parameters
      .filter((param: any) => param.type !== 'body')
      .map((param: any) => buildParameter(param));

    // Handle request body
    const bodyParam = operationMetadata.parameters.find(
      (param: any) => param.type === 'body'
    );
    if (bodyParam) {
      operation.requestBody = buildRequestBody(bodyParam);
    }
  }

  // Process security
  if (operationMetadata.security && operationMetadata.security.length > 0) {
    operation.security = operationMetadata.security;
  }

  // Process consumes/produces
  if (operationMetadata.consumes) {
    // Handle in requestBody content types
  }

  return operation;
}

/**
 * Build OpenAPI response object
 */
function buildResponse(response: any): OpenApiResponse {
  const openApiResponse: OpenApiResponse = {
    description: response.description || `${response.status} response`,
  };

  if (response.type) {
    const schema = getSchemaReference(response.type, response.isArray);
    openApiResponse.content = {
      'application/json': {
        schema,
      },
    };
  }

  if (response.headers) {
    openApiResponse.headers = response.headers;
  }

  return openApiResponse;
}

/**
 * Build OpenAPI parameter object
 */
function buildParameter(param: any): OpenApiParameter {
  const parameter: OpenApiParameter = {
    name: param.name || 'parameter',
    in:
      param.in || param.type === 'query'
        ? 'query'
        : param.type === 'param'
          ? 'path'
          : 'header',
    description: param.description,
    required: param.required !== false && param.in === 'path',
    schema: param.schema || { type: 'string' },
  };

  if (param.example !== undefined) {
    parameter.example = param.example;
  }

  return parameter;
}

/**
 * Build OpenAPI request body object
 */
function buildRequestBody(param: any): OpenApiRequestBody {
  let schema: OpenApiSchema;

  if (param.type) {
    schema = getSchemaReference(param.type);
  } else {
    schema = { type: 'object' };
  }

  const requestBody: OpenApiRequestBody = {
    description: param.description || 'Request body',
    required: param.required !== false,
    content: {
      'application/json': {
        schema,
      },
    },
  };

  return requestBody;
}

/**
 * Get schema reference for a type
 */
function getSchemaReference(
  type: any,
  isArray: boolean = false
): OpenApiSchema {
  let schema: OpenApiSchema;

  if (typeof type === 'string') {
    schema = { $ref: `#/components/schemas/${type}` };
  } else if (typeof type === 'function' && type.name) {
    schema = { $ref: `#/components/schemas/${type.name}` };
  } else {
    schema = { type: 'object' };
  }

  if (isArray) {
    return {
      type: 'array',
      items: schema,
    };
  }

  return schema;
}

/**
 * Normalize OpenAPI path format
 */
function normalizePath(path: string): string {
  return (
    path.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '') || '/'
  );
}
