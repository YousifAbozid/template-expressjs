import type { Request, Response, NextFunction } from 'express';
import type { ApiError } from '@/types';

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

  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    ...(err.errors && { errors: err.errors }),
  });
};
