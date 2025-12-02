import type { Request } from 'express';

/**
 * Simple validation helpers
 * Note: The main validation is handled by class-validator in the middleware
 */

/**
 * Validate required string
 */
export const validateRequiredString = (
  value: any,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 255
): { isValid: boolean; error?: string } => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  const trimmed = value.trim();
  if (trimmed.length < minLength) {
    return {
      isValid: false,
      error: `${fieldName} must be at least ${minLength} characters`,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} must be no more than ${maxLength} characters`,
    };
  }

  return { isValid: true };
};

/**
 * Validate email format
 */
export const validateEmail = (
  email: any
): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true };
};

/**
 * Validate MongoDB ObjectId
 */
export const validateMongoId = (
  id: any
): { isValid: boolean; error?: string } => {
  if (!id || typeof id !== 'string') {
    return { isValid: false, error: 'ID is required' };
  }

  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!mongoIdRegex.test(id)) {
    return { isValid: false, error: 'Invalid ID format' };
  }

  return { isValid: true };
};

/**
 * Extract pagination parameters
 */
export const getPaginationParams = (
  req: Request
): { page: number; limit: number } => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 10)
  );

  return { page, limit };
};
