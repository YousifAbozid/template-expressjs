import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

/**
 * Global rate limiter middleware
 * Limits requests based on IP address
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: _req => config.env === 'development', // Skip rate limiting in development
});

/**
 * Authentication rate limiter
 * Stricter limits for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 login/signup requests per hour
  standardHeaders: true,
  legacyHeaders: false,
  message:
    'Too many login attempts from this IP, please try again after an hour',
  skip: _req => config.env === 'development', // Skip rate limiting in development
});
