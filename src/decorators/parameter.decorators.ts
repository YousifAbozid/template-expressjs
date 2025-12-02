import 'reflect-metadata';

export interface ParameterOptions {
  name?: string;
  description?: string;
  required?: boolean;
  type?: any;
  example?: any;
  schema?: any;
}

/**
 * Decorator for request body parameters
 */
export function Body(options: ParameterOptions = {}) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = {
      ...options,
      type: 'body',
      in: 'body',
    };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}

/**
 * Decorator for query parameters
 */
export function Query(name?: string, options: ParameterOptions = {}) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = {
      ...options,
      name: name || options.name,
      type: 'query',
      in: 'query',
    };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}

/**
 * Decorator for path parameters
 */
export function Param(name?: string, options: ParameterOptions = {}) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = {
      ...options,
      name: name || options.name,
      type: 'param',
      in: 'path',
      required: true, // Path parameters are always required
    };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}

/**
 * Decorator for header parameters
 */
export function Header(name?: string, options: ParameterOptions = {}) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = {
      ...options,
      name: name || options.name,
      type: 'header',
      in: 'header',
    };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}

/**
 * Decorator for uploaded files
 */
export function UploadedFile(options: ParameterOptions = {}) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = {
      ...options,
      type: 'file',
      in: 'formData',
    };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}

/**
 * Decorator for multiple uploaded files
 */
export function UploadedFiles(options: ParameterOptions = {}) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = {
      ...options,
      type: 'files',
      in: 'formData',
    };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}
