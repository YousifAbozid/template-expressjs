import type { Response } from 'express';
import type { ApiResponse, PaginatedResponse } from '@/types/index.js';

/**
 * Send a successful API response
 */
export const sendSuccess = <T = any>(
  res: Response,
  data?: T,
  message: string = 'Success',
  statusCode: number = 200
): void => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };

  res.status(statusCode).json(response);
};

/**
 * Send an error API response
 */
export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors?: Array<{ field: string; message: string }>
): void => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };

  res.status(statusCode).json(response);
};

/**
 * Send a paginated API response
 */
export const sendPaginated = <T = any>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message: string = 'Success'
): void => {
  const pages = Math.ceil(total / limit);

  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination: {
      page,
      limit,
      total,
      pages,
    },
  };

  res.status(200).json(response);
};

/**
 * Create a standardized API error
 */
export const createApiError = (
  message: string,
  statusCode: number = 500,
  errors?: Array<{ field: string; message: string }>
): Error => {
  const error = new Error(message) as any;
  error.statusCode = statusCode;
  error.isOperational = true;
  if (errors) {
    error.errors = errors;
  }
  return error;
};
