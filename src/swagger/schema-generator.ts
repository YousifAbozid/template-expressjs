import 'reflect-metadata';
import { ApiPropertyOptions } from '@/decorators/api-property.decorator.js';
// User enums removed - add your domain-specific enums here

export interface OpenApiSchema {
  type?: string;
  format?: string;
  description?: string;
  example?: any;
  enum?: any[];
  items?: OpenApiSchema;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  nullable?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  $ref?: string;
}

export interface OpenApiParameter {
  name: string;
  in: 'path' | 'query' | 'header' | 'cookie';
  description?: string;
  required?: boolean;
  schema: OpenApiSchema;
  example?: any;
}

export interface OpenApiRequestBody {
  description?: string;
  content: {
    [mediaType: string]: {
      schema: OpenApiSchema;
      example?: any;
    };
  };
  required?: boolean;
}

export interface OpenApiResponse {
  description: string;
  content?: {
    [mediaType: string]: {
      schema: OpenApiSchema;
      example?: any;
    };
  };
  headers?: Record<string, any>;
}

export interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  parameters?: OpenApiParameter[];
  requestBody?: OpenApiRequestBody;
  responses: Record<string, OpenApiResponse>;
  security?: Record<string, string[]>[];
  deprecated?: boolean;
}

export interface OpenApiPath {
  [method: string]: OpenApiOperation;
}

export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    description?: string;
    version: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
    license?: {
      name: string;
      url?: string;
    };
  };
  servers: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, OpenApiPath>;
  components: {
    schemas: Record<string, OpenApiSchema>;
    securitySchemes: Record<string, any>;
    parameters?: Record<string, OpenApiParameter>;
    responses?: Record<string, OpenApiResponse>;
  };
  security?: Record<string, string[]>[];
  tags?: Array<{
    name: string;
    description?: string;
  }>;
}

/**
 * Generate OpenAPI schema from class metadata
 */
export function generateSchemaFromClass(
  target: any,
  className?: string
): OpenApiSchema {
  const schemaName = className || target.name;
  const properties: Record<string, OpenApiSchema> = {};
  const required: string[] = [];

  // Get all properties with swagger metadata
  const swaggerProperties =
    Reflect.getMetadata('swagger:properties', target.prototype) || {};

  for (const [propertyKey, options] of Object.entries(swaggerProperties)) {
    const propertyOptions = options as ApiPropertyOptions;
    const propertySchema = generatePropertySchema(propertyOptions);

    properties[propertyKey] = propertySchema;

    if (propertyOptions.required !== false && !propertyOptions.nullable) {
      required.push(propertyKey);
    }
  }

  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

/**
 * Generate schema for individual property
 */
export function generatePropertySchema(
  options: ApiPropertyOptions
): OpenApiSchema {
  const schema: OpenApiSchema = {};

  // Handle type
  if (options.type) {
    if (options.isArray || Array.isArray(options.type)) {
      schema.type = 'array';
      const itemType = Array.isArray(options.type)
        ? options.type[0]
        : options.type;
      schema.items = getTypeSchema(itemType);
    } else {
      Object.assign(schema, getTypeSchema(options.type));
    }
  }

  // Handle enum
  if (options.enum) {
    schema.enum = Object.values(options.enum);
    if (options.enumName) {
      schema.description = `${schema.description || ''} (${options.enumName})`;
    }
  }

  // Copy simple properties
  if (options.description) {
    schema.description = options.description;
  }
  if (options.example !== undefined) {
    schema.example = options.example;
  }
  if (options.format) {
    schema.format = options.format;
  }
  if (options.nullable) {
    schema.nullable = options.nullable;
  }
  if (options.minLength !== undefined) {
    schema.minLength = options.minLength;
  }
  if (options.maxLength !== undefined) {
    schema.maxLength = options.maxLength;
  }
  if (options.minimum !== undefined) {
    schema.minimum = options.minimum;
  }
  if (options.maximum !== undefined) {
    schema.maximum = options.maximum;
  }

  return schema;
}

/**
 * Get OpenAPI schema for TypeScript types
 */
function getTypeSchema(type: any): OpenApiSchema {
  // Handle primitive types
  if (type === String || type === 'string') {
    return { type: 'string' };
  }
  if (type === Number || type === 'number') {
    return { type: 'number' };
  }
  if (type === Boolean || type === 'boolean') {
    return { type: 'boolean' };
  }
  if (type === Date || type === 'date') {
    return { type: 'string', format: 'date-time' };
  }
  if (type === Object || type === 'object') {
    return { type: 'object' };
  }
  if (type === Array || type === 'array') {
    return { type: 'array', items: { type: 'string' } };
  }

  // Handle enums
  // Add your domain-specific enum handling here
  // Example:
  // if (type === YourEnum) {
  //   return {
  //     type: 'string',
  //     enum: Object.values(YourEnum),
  //   };
  // }

  // Handle class references (will be resolved as $ref later)
  if (typeof type === 'function' && type.prototype) {
    return { $ref: `#/components/schemas/${type.name}` };
  }

  // Default to string for unknown types
  return { type: 'string' };
}

/**
 * Extract controller metadata for OpenAPI generation
 */
export function extractControllerMetadata(controller: any) {
  const controllerTags = Reflect.getMetadata('swagger:tags', controller) || [];
  const basePath =
    Reflect.getMetadata('controller:basePath', controller) || '/';
  const controllerSecurity =
    Reflect.getMetadata('swagger:security', controller) || [];

  const routes: Array<{
    method: string;
    path: string;
    handler: string;
    operation: any;
  }> = [];

  const prototype = controller.prototype;
  const methodNames = Object.getOwnPropertyNames(prototype).filter(
    name => name !== 'constructor' && typeof prototype[name] === 'function'
  );

  for (const methodName of methodNames) {
    const method = Reflect.getMetadata('route:method', prototype, methodName);
    const path = Reflect.getMetadata('route:path', prototype, methodName);

    if (method && path) {
      const operation = Reflect.getMetadata(
        'swagger:operation',
        prototype,
        methodName
      );
      const responses =
        Reflect.getMetadata('swagger:responses', prototype, methodName) || [];
      const parameters =
        Reflect.getMetadata('swagger:parameters', prototype, methodName) || [];
      const security =
        Reflect.getMetadata('swagger:security', prototype, methodName) ||
        controllerSecurity;
      const consumes = Reflect.getMetadata(
        'swagger:consumes',
        prototype,
        methodName
      );
      const produces = Reflect.getMetadata(
        'swagger:produces',
        prototype,
        methodName
      );

      routes.push({
        method: method.toLowerCase(),
        path: basePath + path,
        handler: methodName,
        operation: {
          ...operation,
          tags: operation?.tags || controllerTags,
          responses,
          parameters,
          security,
          consumes,
          produces,
        },
      });
    }
  }

  return {
    basePath,
    tags: controllerTags,
    security: controllerSecurity,
    routes,
  };
}
