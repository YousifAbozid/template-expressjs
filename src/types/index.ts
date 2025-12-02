import type { Request, Response, NextFunction } from 'express';

// Base API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
  errors?: ValidationError[];
}

// Express middleware types
export interface AuthenticatedRequest extends Request {
  user?: any; // Replace with actual user type when implementing auth
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type AsyncAuthRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

// Configuration types
export interface DatabaseConfig {
  url: string;
}

export interface SessionConfig {
  secret: string;
}

export interface CorsConfig {
  origin: string;
}

export interface AppConfig {
  env: string;
  port: number;
  db: DatabaseConfig;
  session: SessionConfig;
  cors: CorsConfig;
}

// Health check response
export interface HealthResponse {
  status: 'ok' | 'error';
  uptime: number;
  timestamp: string;
  environment: string;
}
