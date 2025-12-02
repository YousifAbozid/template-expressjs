import type { Request, Response, NextFunction } from 'express';
import type { ValidationError } from '@/types';

/**
 * Process validation results middleware
 * Collects validation errors and formats them for consistent API responses
 */
export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Simple validation - in a real app you would use express-validator
  // For now, we'll just pass through
  next();
};

/**
 * Create a simple validation error
 */
export const createValidationError = (
  field: string,
  message: string
): ValidationError => ({
  field,
  message,
});

/**
 * Send validation error response
 */
export const sendValidationError = (
  res: Response,
  errors: ValidationError[],
  next: NextFunction
): void => {
  res.status(400);
  next({
    message: 'Validation failed',
    errors,
  });
};
