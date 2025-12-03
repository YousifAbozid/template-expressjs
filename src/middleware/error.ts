import type { Request, Response, NextFunction } from 'express';
import type { ApiError } from '@/types/index.js';
import { ErrorResponseDto, ValidationErrorDto } from '@/dto/common/index.js';

/**
 * Handle 404 errors
 */
export const notFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new Error(`Not Found - ${req.originalUrl}`) as ApiError;
  res.status(404);
  console.warn(`404 - ${req.method} ${req.originalUrl} - ${req.ip}`);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Log error details
  const logMessage = `${statusCode} - ${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`;
  if (statusCode >= 500) {
    console.error(logMessage, err.stack);
  } else {
    console.warn(logMessage);
  }

  // Create standardized error response
  const errorCode = getErrorCode(statusCode, err);
  const validationErrors = err.errors
    ? err.errors.map(
        (error: any) =>
          new ValidationErrorDto(
            error.field || error.param || 'unknown',
            error.constraints || {
              message: error.message || 'Validation error',
            },
            error.value
          )
      )
    : undefined;

  const errorResponse = new ErrorResponseDto(
    err.message,
    errorCode,
    statusCode,
    req.originalUrl,
    validationErrors
  );

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    (errorResponse as any).stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};

/**
 * Get appropriate error code based on status code and error details
 */
function getErrorCode(statusCode: number, err: ApiError): string {
  if (err.code && typeof err.code === 'string') {
    return err.code;
  }

  switch (statusCode) {
    case 400:
      return 'BAD_REQUEST';
    case 401:
      return 'UNAUTHORIZED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 409:
      return 'CONFLICT';
    case 422:
      return 'UNPROCESSABLE_ENTITY';
    case 429:
      return 'TOO_MANY_REQUESTS';
    case 500:
      return 'INTERNAL_SERVER_ERROR';
    case 502:
      return 'BAD_GATEWAY';
    case 503:
      return 'SERVICE_UNAVAILABLE';
    case 504:
      return 'GATEWAY_TIMEOUT';
    default:
      return 'UNKNOWN_ERROR';
  }
}
