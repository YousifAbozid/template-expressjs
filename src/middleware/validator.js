import { validationResult } from 'express-validator';

/**
 * Process validation results middleware
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  res.status(400);
  return next({
    message: 'Validation error',
    errors: errors.array().map(err => ({
      field: err.path,
      message: err.msg,
    })),
  });
};
