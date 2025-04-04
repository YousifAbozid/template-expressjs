import logger from '../config/logger.js';

/**
 * Handle 404 errors
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  logger.warn(`404 - ${req.method} ${req.originalUrl} - ${req.ip}`);
  next(error);
};

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, _next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  // Log error details
  const logMessage = `${statusCode} - ${err.message} - ${req.method} ${req.originalUrl} - ${req.ip}`;
  if (statusCode >= 500) {
    logger.error(logMessage, { stack: err.stack });
  } else {
    logger.warn(logMessage);
  }

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    errors: err.errors || undefined,
  });
};
