import type { Request, Response, NextFunction } from 'express';
import type { AsyncRequestHandler } from '@/types';

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/route', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn: AsyncRequestHandler) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Higher-order function to create typed route handlers
 */
export const createHandler = <T extends Request = Request>(
  handler: (req: T, res: Response, next: NextFunction) => Promise<void>
) => {
  return asyncHandler(handler as AsyncRequestHandler);
};
