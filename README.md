# Express TypeScript API Template

A production-ready Express.js API template with TypeScript, OpenAPI documentation, and comprehensive developer tools for rapid API development.

## ✨ Features

- **TypeScript** - Full TypeScript support with strict type checking
- **OpenAPI/Swagger** - Automatic API documentation and type generation
- **Type Safety** - Frontend-backend type synchronization
- **Modern Development** - Hot reload, ESLint, Prettier, Git hooks
- **Production Ready** - Security, validation, error handling, rate limiting

### Technical Stack

- **Framework**: Express.js with TypeScript
- **Documentation**: OpenAPI 3.0 with Swagger UI
- **Database**: MongoDB with Mongoose (ready to configure)
- **Security**: Helmet, CORS, Rate limiting, HPP protection
- **Validation**: Custom validation utilities (extensible)
- **Code Quality**: ESLint, Prettier, Husky, lint-staged
- **Development**: Hot reload, source maps, path aliases

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (if using database features)

### Installation

```bash
# Clone the template
git clone <your-repo-url>
cd template-expressjs

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled version
npm run type-check   # Check TypeScript types

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format:all   # Format with Prettier
npm run fix-all      # Fix linting + formatting

# Type Generation (when you add OpenAPI docs)
npm run generate:types   # Generate types from OpenAPI spec
npm run generate:client  # Generate API client
```

## 📁 Project Structure

```
src/
├── types/                 # TypeScript type definitions
│   ├── index.ts          # Core application types
│   └── schemas.ts        # OpenAPI schema definitions
├── config/               # Configuration files
│   ├── index.ts         # App configuration
│   ├── db.ts            # Database connection
│   └── swagger.ts       # OpenAPI configuration
├── middleware/           # Express middleware
│   ├── error.ts         # Error handling
│   ├── rateLimiter.ts   # Rate limiting
│   └── validator.ts     # Validation helpers
├── routes/              # API routes
│   └── index.ts         # Health check + route setup
├── utils/               # Utility functions
│   ├── response.ts      # API response helpers
│   ├── asyncHandler.ts  # Async error handling
│   └── validation.ts    # Validation utilities
├── app.ts               # Express app configuration
└── index.ts             # Server entry point
```

## 📖 API Documentation

Once running, visit:

- **API Documentation**: `http://localhost:5000/api/docs`
- **Health Check**: `http://localhost:5000/api/health`

## 🛠️ Development Guide

### Adding New Routes

1. **Create route file** in `src/routes/`:

```typescript
// src/routes/users.ts
import { Router } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import { sendSuccess } from '@/utils/response';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 */
router.get(
  '/',
  asyncHandler(async (req, res) => {
    sendSuccess(res, [], 'Users retrieved');
  })
);

export default router;
```

2. **Register route** in `src/routes/index.ts`:

```typescript
import userRoutes from './users.js';
router.use('/users', userRoutes);
```

### Adding Types

Define types in `src/types/index.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

### OpenAPI Documentation

Document APIs with JSDoc comments:

```typescript
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
```

### Error Handling

Use the async handler for automatic error catching:

```typescript
import { asyncHandler } from '@/utils/asyncHandler';
import { createApiError } from '@/utils/response';

router.get(
  '/users/:id',
  asyncHandler(async (req, res) => {
    const user = await findUser(req.params.id);
    if (!user) {
      throw createApiError('User not found', 404);
    }
    sendSuccess(res, user);
  })
);
```

### Validation

Use built-in validation utilities:

```typescript
import { validateRequiredString, validateEmail } from '@/utils/validation';

const nameValidation = validateRequiredString(req.body.name, 'name', 2, 50);
if (!nameValidation.isValid) {
  throw createApiError(nameValidation.error!, 400);
}
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/your-db
SESSION_SECRET=your-session-secret
CORS_ORIGIN=*
```

### TypeScript Configuration

The project uses strict TypeScript settings. Modify `tsconfig.json` for your needs:

- Path aliases (`@/types`, `@/utils`, etc.)
- Strict type checking enabled
- Source maps for debugging
- Declaration files generation

### Database Setup

Configure MongoDB connection in `src/config/db.ts`:

```typescript
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.db.url);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};
```

## 🔄 Type Generation & Frontend Integration

### Generate Types from API

```bash
# Generate TypeScript types from OpenAPI spec
npm run generate:types

# Generate complete API client for frontend
npm run generate:client
```

### Frontend Integration

1. **Share types** with frontend team
2. **Use generated client** in React/Vue/Angular apps
3. **Maintain type sync** automatically through CI/CD

Example frontend usage:

```typescript
import type { User } from './types/api';
import { ApiClient } from './types/client';

const client = new ApiClient('http://localhost:5000');
const users: User[] = await client.getUsers();
```

## 🚦 Best Practices

### API Responses

Always use response utilities:

```typescript
// Success
sendSuccess(res, data, 'Operation successful');

// Error
sendError(res, 'Error message', 400);

// Paginated
sendPaginated(res, items, page, limit, total);
```

### Rate Limiting

Apply appropriate limits:

```typescript
import { strictLimiter, createRateLimiter } from '@/middleware/rateLimiter';

// Sensitive endpoints
router.post('/auth/login', strictLimiter, ...);

// Custom limits
const uploadLimiter = createRateLimiter(60000, 5); // 5 per minute
```

### Error Handling

Create meaningful errors:

```typescript
throw createApiError('Resource not found', 404, [
  { field: 'id', message: 'Invalid user ID format' },
]);
```

## 📈 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Setup

- Set `NODE_ENV=production`
- Configure secure session secrets
- Set up proper CORS origins
- Configure database connection pooling
- Set up monitoring and logging

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. **Read** `src/README.md` for detailed development guide
2. **Follow** TypeScript strict mode guidelines
3. **Document** APIs with OpenAPI comments
4. **Test** with provided utilities
5. **Maintain** type safety throughout

## 📝 Developer Resources

- **Detailed Guide**: `src/README.md` - Comprehensive development documentation
- **API Docs**: `/api/docs` - Interactive OpenAPI documentation
- **Health Check**: `/api/health` - Service status endpoint
- **TypeScript**: [typescript-lang.org](https://www.typescriptlang.org/)
- **OpenAPI**: [swagger.io/specification](https://swagger.io/specification/)

## 📄 License

MIT License - see LICENSE file for details.

---

**Happy coding!** 🚀 This template provides everything you need to build scalable, type-safe APIs quickly.

For questions or issues, refer to the detailed documentation in `src/README.md`.
