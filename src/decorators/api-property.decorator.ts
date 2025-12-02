import 'reflect-metadata';

export interface ApiPropertyOptions {
  description?: string;
  example?: any;
  enum?: any;
  type?: any;
  format?: string;
  required?: boolean;
  nullable?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  enumName?: string;
  isArray?: boolean;
  items?: {
    type?: any;
    enum?: any;
  };
}

/**
 * Decorator to mark class properties for OpenAPI documentation
 */
export function ApiProperty(options: ApiPropertyOptions = {}) {
  return function (target: any, propertyKey: string) {
    const existingProps =
      Reflect.getMetadata('swagger:properties', target) || {};
    existingProps[propertyKey] = options;
    Reflect.defineMetadata('swagger:properties', existingProps, target);

    // Also store on the property itself for easier access
    Reflect.defineMetadata('swagger:property', options, target, propertyKey);
  };
}

/**
 * Decorator for array properties with specific item types
 */
export function ApiPropertyArray(
  itemType: any,
  options: Omit<ApiPropertyOptions, 'type' | 'isArray'> = {}
) {
  return ApiProperty({
    ...options,
    type: [itemType],
    isArray: true,
  });
}

/**
 * Decorator for optional properties
 */
export function ApiPropertyOptional(options: ApiPropertyOptions = {}) {
  return ApiProperty({
    ...options,
    required: false,
  });
}
