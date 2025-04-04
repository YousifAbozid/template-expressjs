import { body, param, validationResult } from 'express-validator';

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

/**
 * User validation rules
 */
export const userValidation = {
  createUser: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('Password is required')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate,
  ],

  updateUser: [
    param('id').isMongoId().withMessage('Invalid user ID format'),
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    body('password')
      .optional()
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    validate,
  ],

  getUserById: [
    param('id').isMongoId().withMessage('Invalid user ID format'),
    validate,
  ],
};

/**
 * Authentication validation rules
 */
export const authValidation = {
  login: [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    body('password').trim().notEmpty().withMessage('Password is required'),
    validate,
  ],
};
