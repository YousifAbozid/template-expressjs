import 'reflect-metadata';

/**
 * Decorator to tag controllers/endpoints for grouping in Swagger UI
 */
export function ApiTags(...tags: string[]) {
  return function (target: any) {
    Reflect.defineMetadata('swagger:tags', tags, target);
  };
}

/**
 * Decorator to require Bearer authentication for an endpoint
 */
export function ApiBearerAuth(name: string = 'bearerAuth') {
  return function (target: any, propertyKey?: string) {
    const securityRequirement = { [name]: [] };

    if (propertyKey) {
      // Applied to method
      const existingSecurity =
        Reflect.getMetadata('swagger:security', target, propertyKey) || [];
      existingSecurity.push(securityRequirement);
      Reflect.defineMetadata(
        'swagger:security',
        existingSecurity,
        target,
        propertyKey
      );
    } else {
      // Applied to class
      Reflect.defineMetadata('swagger:security', [securityRequirement], target);
    }
  };
}

/**
 * Decorator to specify API key authentication
 */
export function ApiKeyAuth(
  name: string = 'apiKey',
  keyIn: 'header' | 'query' | 'cookie' = 'header'
) {
  return function (target: any, propertyKey?: string) {
    const securityRequirement = { [name]: [] };

    if (propertyKey) {
      const existingSecurity =
        Reflect.getMetadata('swagger:security', target, propertyKey) || [];
      existingSecurity.push(securityRequirement);
      Reflect.defineMetadata(
        'swagger:security',
        existingSecurity,
        target,
        propertyKey
      );
    } else {
      Reflect.defineMetadata('swagger:security', [securityRequirement], target);
    }
  };
}

/**
 * Decorator to specify content type for request body
 */
export function ApiConsumes(...mimeTypes: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('swagger:consumes', mimeTypes, target, propertyKey);
  };
}

/**
 * Decorator to specify content type for responses
 */
export function ApiProduces(...mimeTypes: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('swagger:produces', mimeTypes, target, propertyKey);
  };
}
