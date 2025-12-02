import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

// Global rate limiting
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Strict rate limiting for sensitive endpoints
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Custom rate limiter factory
export const createRateLimiter = (
  windowMs: number,
  max: number,
  message?: string
) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Rate limit exceeded, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
