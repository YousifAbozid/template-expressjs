# Express TypeScript API Template - Developer Guide

Welcome to the Express TypeScript API Template! This guide will help you quickly implement new features and understand the project structure.

## 🏗️ Project Structure

```
src/
├── types/                 # TypeScript type definitions
│   ├── index.ts          # Core types and interfaces
│   └── schemas.ts        # OpenAPI schema definitions
├── config/               # Configuration files
│   ├── index.ts         # Application configuration
│   ├── db.ts            # Database connection
│   └── swagger.ts       # OpenAPI/Swagger configuration
├── middleware/           # Express middleware
│   ├── error.ts         # Error handling middleware
│   ├── rateLimiter.ts   # Rate limiting middleware
│   └── validator.ts     # Validation middleware
├── routes/              # API route definitions
│   └── index.ts         # Main routes (health check)
├── utils/               # Utility functions
│   ├── response.ts      # API response helpers
│   ├── asyncHandler.ts  # Async error handling
│   └── validation.ts    # Common validation rules
├── app.ts               # Express app configuration
└── index.ts             # Server entry point
```

## 🚀 Quick Start

### Development

```bash
npm run dev          # Start development server with hot reload
npm run type-check   # Check TypeScript types without compiling
npm run lint         # Run linting
npm run fix-all      # Fix linting and formatting issues
```

### Building

```bash
npm run build        # Compile TypeScript to JavaScript
npm run start        # Run compiled JavaScript (production)
npm run clean        # Remove dist folder
```

### Type Generation

```bash
npm run generate:types   # Generate types from OpenAPI spec
npm run generate:client  # Generate API client from OpenAPI spec
```

## 📝 Adding New Features

### 1. Creating a New Route

1. **Create the route file** in `src/routes/`:

```typescript
// src/routes/users.ts
import { Router } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess, sendError } from '@/utils/response';
import { validate } from '@/middleware/validator';
import { commonValidation } from '@/utils/validation';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get(
  '/',
  commonValidation.pagination(),
  validate,
  asyncHandler(async (req, res) => {
    // Your logic here
    sendSuccess(res, [], 'Users retrieved successfully');
  })
);

export default router;
```

2. **Add the route to main router** in `src/routes/index.ts`:

```typescript
import userRoutes from './users';

// Add this line
router.use('/users', userRoutes);
```

### 2. Creating Types

1. **Add to type definitions** in `src/types/index.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserRequest {
  name: string;
  email: string;
}
```

2. **Add OpenAPI schemas** in `src/types/schemas.ts`:

```typescript
export const UserSchemas = {
  User: {
    type: 'object',
    properties: {
      id: { type: 'string', example: '507f1f77bcf86cd799439011' },
      name: { type: 'string', example: 'John Doe' },
      email: { type: 'string', example: 'john@example.com' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  CreateUserRequest: {
    type: 'object',
    required: ['name', 'email'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 50 },
      email: { type: 'string', format: 'email' },
    },
  },
} as const;

// Add to CommonSchemas
export const CommonSchemas = {
  // ... existing schemas
  ...UserSchemas,
} as const;
```

### 3. Adding Database Models (MongoDB with Mongoose)

```typescript
// src/models/user.ts
import mongoose, { Schema, Document } from 'mongoose';
import type { User } from '@/types';

export interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
```

### 4. Creating Middleware

```typescript
// src/middleware/auth.ts
import type { Request, Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '@/types';
import { createApiError } from '@/utils/response';

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(createApiError('Authentication required', 401));
  }

  // Your auth logic here
  next();
};
```

## 🔧 Best Practices

### Error Handling

Always use the `asyncHandler` wrapper for async routes:

```typescript
import { asyncHandler } from '@/utils/asyncHandler';
import { createApiError } from '@/utils/response';

router.post(
  '/users',
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw createApiError('User already exists', 400);
    }

    // Create user logic...
    sendSuccess(res, newUser, 'User created successfully', 201);
  })
);
```

### Validation

Use the validation utilities for consistent validation:

```typescript
import { commonValidation } from '@/utils/validation';
import { body } from 'express-validator';

const createUserValidation = [
  commonValidation.requiredString('name', 2, 50),
  commonValidation.email(),
  body('age')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('Age must be between 0 and 120'),
];

router.post('/users', createUserValidation, validate, asyncHandler(...));
```

### Response Formatting

Always use the response utilities for consistent API responses:

```typescript
import { sendSuccess, sendError, sendPaginated } from '@/utils/response';

// Success response
sendSuccess(res, userData, 'User retrieved successfully');

// Error response
sendError(res, 'User not found', 404);

// Paginated response
sendPaginated(res, users, page, limit, total, 'Users retrieved successfully');
```

### Rate Limiting

Apply appropriate rate limiting:

```typescript
import { strictLimiter, createRateLimiter } from '@/middleware/rateLimiter';

// For sensitive endpoints
router.post('/auth/login', strictLimiter, ...);

// Custom rate limiter
const customLimiter = createRateLimiter(5 * 60 * 1000, 10); // 10 requests per 5 minutes
router.post('/upload', customLimiter, ...);
```

## 📚 OpenAPI Documentation

### Adding Documentation

Document your APIs using OpenAPI comments:

```typescript
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */
```

### Generating Types

After updating your OpenAPI documentation:

```bash
npm run generate:types    # Generate TypeScript types
npm run generate:client   # Generate API client for frontend
```

## 🔄 Type Synchronization with Frontend

1. **Generate types** from your OpenAPI spec:

   ```bash
   npm run generate:types
   ```

2. **Share generated types** with your frontend team or publish them as a package

3. **Use generated client** in frontend applications:
   ```bash
   npm run generate:client
   ```

## 🚨 Common Patterns

### Database Operations with Error Handling

```typescript
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await UserModel.findById(id);
  if (!user) {
    throw createApiError('User not found', 404);
  }

  sendSuccess(res, user, 'User retrieved successfully');
});
```

### Input Validation and Sanitization

```typescript
const updateUserValidation = [
  commonValidation.mongoId(),
  commonValidation.optionalString('name', 2, 50),
  commonValidation.email().optional(),
];
```

### Paginated Responses

```typescript
const getUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    UserModel.find().skip(skip).limit(limit),
    UserModel.countDocuments(),
  ]);

  sendPaginated(res, users, page, limit, total);
});
```

## 🐛 Debugging

### TypeScript Issues

- Run `npm run type-check` to check for type errors
- Use `// @ts-ignore` sparingly and document why
- Check `tsconfig.json` path mappings if imports fail

### Runtime Issues

- Check console logs for detailed error information
- Use the `/api/health` endpoint to verify server status
- Review middleware order in `app.ts`

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)

Happy coding! 🚀
