/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Error400 {
  /** @example false */
  success?: boolean;
  /** @example "Bad Request" */
  message?: string;
  errors?: {
    /** @example "email" */
    field?: string;
    /** @example "Invalid email format" */
    message?: string;
  }[];
}

export interface Error404 {
  /** @example false */
  success?: boolean;
  /** @example "Resource not found" */
  message?: string;
}

export interface Error500 {
  /** @example false */
  success?: boolean;
  /** @example "Internal server error" */
  message?: string;
}

export interface HealthCheck {
  /** @example "ok" */
  status?: string;
  /** @example 123.45 */
  uptime?: number;
  /** @example "2025-12-02T10:30:00.000Z" */
  timestamp?: string;
  /** @example "development" */
  environment?: string;
}

export interface ErrorResponseDto {
  /**
   * Error message
   * @example "Validation failed"
   */
  message: string;
  /**
   * Error code
   * @example "VALIDATION_ERROR"
   */
  code: string;
  /**
   * HTTP status code
   * @example 400
   */
  statusCode: number;
  /** Validation errors */
  errors?: string[];
  /**
   * Error timestamp
   * @example "2024-01-01T00:00:00.000Z"
   */
  timestamp: string;
  /**
   * Request path that caused the error
   * @example "/api/users"
   */
  path?: string;
}

export interface ValidationErrorDto {
  /**
   * Field name that failed validation
   * @example "email"
   */
  field: string;
  /**
   * Validation constraints that were violated
   * @example {"isEmail":"Must be a valid email address"}
   */
  constraints: object;
  /**
   * The value that failed validation
   * @example "invalid-email"
   */
  value?: string;
}

export interface SuccessResponseDto {
  /**
   * Success status
   * @example true
   */
  success: boolean;
  /**
   * Success message
   * @example "Operation completed successfully"
   */
  message: string;
  /** Response data */
  data?: any;
  /**
   * Response timestamp
   * @example "2024-01-01T00:00:00.000Z"
   */
  timestamp: string;
}

export interface PaginationQueryDto {
  /**
   * Page number
   * @min 1
   * @example 1
   */
  page?: number;
  /**
   * Items per page
   * @min 1
   * @max 100
   * @example 10
   */
  limit?: number;
}
