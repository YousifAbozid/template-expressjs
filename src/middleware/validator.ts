import type { Request, Response, NextFunction } from 'express';
import {
  validate,
  ValidationError as ClassValidationError,
} from 'class-validator';
import { plainToClass, Transform } from 'class-transformer';
import { ErrorResponseDto, ValidationErrorDto } from '@/dto/common/index.js';

/**
 * Create validation middleware for DTOs using class-validator
 */
export function createValidationMiddleware(
  dtoClass: any,
  source: 'body' | 'query' | 'params' = 'body',
  skipMissingProperties: boolean = false
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Transform query/params to proper types
      const data =
        source === 'query' || source === 'params'
          ? transformQueryData(req[source])
          : req[source];

      // Convert plain object to class instance
      const dto = plainToClass(dtoClass, data, {
        excludeExtraneousValues: false,
        enableImplicitConversion: true,
      });

      // Validate the DTO
      const errors = await validate(dto, {
        skipMissingProperties,
        whitelist: true,
        forbidNonWhitelisted: false,
        validationError: { target: false, value: false },
      });

      if (errors.length > 0) {
        const validationErrors = errors.map(
          error =>
            new ValidationErrorDto(
              error.property,
              error.constraints || {},
              error.value
            )
        );

        const errorResponse = new ErrorResponseDto(
          'Validation failed',
          'VALIDATION_ERROR',
          400,
          req.path,
          validationErrors
        );

        res.status(400).json(errorResponse);
        return;
      }

      // Attach validated DTO to request
      req[source] = dto;
      next();
    } catch (error) {
      const errorResponse = new ErrorResponseDto(
        'Internal validation error',
        'INTERNAL_VALIDATION_ERROR',
        500,
        req.path
      );

      res.status(500).json(errorResponse);
    }
  };
}

/**
 * Transform query parameters to proper types
 */
function transformQueryData(data: any): any {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const transformed: any = {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      transformed[key] = value;
      continue;
    }

    if (typeof value === 'string') {
      // Try to convert strings to proper types
      if (value === 'true') {
        transformed[key] = true;
      } else if (value === 'false') {
        transformed[key] = false;
      } else if (value === 'null') {
        transformed[key] = null;
      } else if (value === 'undefined') {
        transformed[key] = undefined;
      } else if (!isNaN(Number(value)) && value.trim() !== '') {
        // Only convert to number if it's a valid number
        const num = Number(value);
        if (Number.isInteger(num)) {
          transformed[key] = parseInt(value, 10);
        } else {
          transformed[key] = parseFloat(value);
        }
      } else {
        transformed[key] = value;
      }
    } else {
      transformed[key] = value;
    }
  }

  return transformed;
}

/**
 * Validation decorator factory for route handlers
 */
export function ValidateBody(
  dtoClass: any,
  skipMissingProperties: boolean = false
) {
  return createValidationMiddleware(dtoClass, 'body', skipMissingProperties);
}

/**
 * Validation decorator for query parameters
 */
export function ValidateQuery(
  dtoClass: any,
  skipMissingProperties: boolean = true
) {
  return createValidationMiddleware(dtoClass, 'query', skipMissingProperties);
}

/**
 * Validation decorator for path parameters
 */
export function ValidateParams(
  dtoClass: any,
  skipMissingProperties: boolean = false
) {
  return createValidationMiddleware(dtoClass, 'params', skipMissingProperties);
}

/**
 * Legacy validation function for backwards compatibility
 */
export const validate_old = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  next();
};

/**
 * Create a simple validation error (legacy)
 */
export const createValidationError = (field: string, message: string): any => ({
  field,
  message,
});

/**
 * Send validation error response (legacy)
 */
export const sendValidationError = (
  res: Response,
  errors: any[],
  next: NextFunction
): void => {
  res.status(400);
  next({
    message: 'Validation failed',
    errors,
  });
};
