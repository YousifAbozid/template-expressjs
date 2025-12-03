import 'reflect-metadata';

export interface ApiOperationOptions {
  summary: string;
  description?: string;
  operationId?: string;
  tags?: string[];
  deprecated?: boolean;
}

/**
 * Decorator to document API operations (endpoints)
 */
export function ApiOperation(options: ApiOperationOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('swagger:operation', options, target, propertyKey);
  };
}

export interface ApiResponseOptions {
  status: number;
  description?: string;
  type?: any;
  isArray?: boolean;
  schema?: any;
  headers?: Record<string, any>;
}

/**
 * Decorator to document API responses
 */
export function ApiResponse(options: ApiResponseOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const existingResponses =
      Reflect.getMetadata('swagger:responses', target, propertyKey) || [];
    existingResponses.push(options);
    Reflect.defineMetadata(
      'swagger:responses',
      existingResponses,
      target,
      propertyKey
    );
  };
}

/**
 * Decorator for 200 OK responses
 */
export function ApiOkResponse(options: Omit<ApiResponseOptions, 'status'>) {
  return ApiResponse({ ...options, status: 200 });
}

/**
 * Decorator for 201 Created responses
 */
export function ApiCreatedResponse(
  options: Omit<ApiResponseOptions, 'status'>
) {
  return ApiResponse({ ...options, status: 201 });
}

/**
 * Decorator for 400 Bad Request responses
 */
export function ApiBadRequestResponse(
  options: Omit<ApiResponseOptions, 'status'> = {}
) {
  return ApiResponse({
    ...options,
    status: 400,
    description: options.description || 'Bad Request',
  });
}

/**
 * Decorator for 401 Unauthorized responses
 */
export function ApiUnauthorizedResponse(
  options: Omit<ApiResponseOptions, 'status'> = {}
) {
  return ApiResponse({
    ...options,
    status: 401,
    description: options.description || 'Unauthorized',
  });
}

/**
 * Decorator for 404 Not Found responses
 */
export function ApiNotFoundResponse(
  options: Omit<ApiResponseOptions, 'status'> = {}
) {
  return ApiResponse({
    ...options,
    status: 404,
    description: options.description || 'Not Found',
  });
}

/**
 * Decorator for 500 Internal Server Error responses
 */
export function ApiInternalServerErrorResponse(
  options: Omit<ApiResponseOptions, 'status'> = {}
) {
  return ApiResponse({
    ...options,
    status: 500,
    description: options.description || 'Internal Server Error',
  });
}

/**
 * Decorator for 503 Service Unavailable responses
 */
export function ApiServiceUnavailableResponse(
  options: Omit<ApiResponseOptions, 'status'> = {}
) {
  return ApiResponse({
    ...options,
    status: 503,
    description: options.description || 'Service Unavailable',
  });
}
