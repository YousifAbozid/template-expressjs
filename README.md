# 🚀 Express TypeScript OpenAPI Template

A modern, production-ready Express.js template with TypeScript, decorator-based OpenAPI/Swagger documentation, and comprehensive validation.

## 📑 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [📋 Development Scripts](#-development-scripts)
- [🎯 Key Features Explained](#-key-features-explained)
- [🔄 Development Workflows](#-development-workflows)
- [🎨 Available Decorators](#-available-decorators)
- [🔧 Generated Files](#-generated-files)
- [⚠️ Important Notes](#️-important-notes)
- [🔒 Security Features](#-security-features)
- [🌐 API Documentation](#-api-documentation)
- [✅ Best Practices](#-best-practices)
- [💡 Why This Template?](#-why-this-template)

## ✨ Features

- 🏗️ **Express.js with TypeScript** - Type-safe backend development
- 📚 **OpenAPI 3.0 / Swagger** - Automatic API documentation generation
- 🎨 **Decorator-based Architecture** - Clean, NestJS-inspired patterns
- ✅ **Comprehensive Validation** - Request/response validation with class-validator
- 🔒 **JWT Authentication** - Built-in authentication middleware
- ⚡ **Rate Limiting** - Protection against abuse
- 🛡️ **Security First** - Helmet, CORS, and security best practices
- 🗃️ **Database Ready** - Configuration for your database of choice
- 📦 **ES Modules** - Modern JavaScript module system
- 🔧 **Developer Tools** - Hot reload, validation, type generation

[↑ Back to Table of Contents](#-table-of-contents)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# View interactive API documentation
open http://localhost:3001/api/docs
```

[↑ Back to Table of Contents](#-table-of-contents)

## 📁 Project Structure

```
src/
├── controllers/     # API route handlers with decorators
├── dto/            # Data Transfer Objects with validation
├── enums/          # Enum definitions
├── decorators/     # OpenAPI decorators (@ApiProperty, etc.)
├── middleware/     # Express middleware (validation, auth)
├── routes/         # Route registration
├── swagger/        # OpenAPI specification generation
├── config/         # Configuration files (DB, Swagger)
├── utils/          # Utility functions
└── types/          # TypeScript type definitions
```

[↑ Back to Table of Contents](#-table-of-contents)

## 📋 Development Scripts

### Core Development

| Script          | Purpose                            | When to Use              |
| --------------- | ---------------------------------- | ------------------------ |
| `npm run dev`   | Development server with hot reload | Daily development        |
| `npm start`     | Production server                  | Testing production build |
| `npm run build` | Production build + API generation  | Before deployment        |
| `npm run clean` | Remove build artifacts             | Clean slate builds       |

### Code Quality & Validation

| Script               | Purpose                                 | When to Use               |
| -------------------- | --------------------------------------- | ------------------------- |
| `npm run test`       | Full validation (format + lint + types) | Before pushing code       |
| `npm run fix`        | Auto-fix linting and formatting         | When you have code issues |
| `npm run lint`       | Check code quality only                 | Quick linting check       |
| `npm run format`     | Format all code                         | Format-specific fixes     |
| `npm run type-check` | TypeScript type checking                | Type-specific validation  |

### API Development Workflow

| Script                 | Purpose                        | When to Use                               |
| ---------------------- | ------------------------------ | ----------------------------------------- |
| `npm run api:generate` | Generate all API artifacts     | **After adding/modifying routes or DTOs** |
| `npm run api:spec`     | Generate OpenAPI specification | When you only need the spec               |
| `npm run api:types`    | Generate TypeScript types      | For frontend type definitions             |
| `npm run api:client`   | Generate API client            | For frontend API client                   |
| `npm run api:validate` | Validate API specification     | Check API spec validity                   |
| `npm run api:docs`     | Serve API documentation        | View Swagger UI docs                      |

[↑ Back to Table of Contents](#-table-of-contents)

## 🎯 Key Features Explained

### Decorator-Based Documentation

```typescript
@ApiTags('Products')
@Controller('/products')
export class ProductController {
  @Get('/')
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ type: ProductPaginationResponseDto })
  async getProducts(@Query() query: GetProductsQueryDto) {
    // Implementation
  }
}
```

### Automatic Validation

```typescript
export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15', minLength: 1, maxLength: 200 })
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty({ example: 999.99, minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;
}
```

### Type-Safe Responses

```typescript
export class ProductResponseDto {
  @ApiProperty({ example: 'prod_123' })
  id: string;

  @ApiProperty({ example: 'iPhone 15' })
  name: string;

  // Automatic OpenAPI schema generation
}
```

[↑ Back to Table of Contents](#-table-of-contents)

## 🔄 Development Workflows

### Adding a New API Endpoint

1. **Create your DTOs** with `@ApiProperty()` and validation decorators
2. **Create Controller** with route and documentation decorators
3. **Add controller to generation script**: Update `scripts/generate-openapi-spec.ts`
4. **Run API generation**: `npm run api:generate`
5. **Test your changes**: `npm run dev`
6. **View API docs**: `npm run api:docs`

**Example workflow:**

```bash
# After creating new routes/DTOs
npm run api:generate    # Generates spec, types, and client
npm run dev            # Test in development
npm run api:docs       # View documentation
npm run test           # Validate before commit
```

### Before Committing Code

Git hooks automatically run checks, but you can run manually:

```bash
npm run fix     # Fix any issues
npm run test    # Full validation
git add .
git commit -m "your message"  # Pre-commit hook runs automatically
```

### Frontend Integration

After adding/modifying API endpoints:

1. **Generate types for frontend**: `npm run api:types`
2. **Copy generated types**: `src/types/api.ts` contains all TypeScript interfaces
3. **Use API client**: `src/types/client.ts` contains API client functions
4. **API specification**: `src/openapi.json` for other tooling

[↑ Back to Table of Contents](#-table-of-contents)

## 🎨 Available Decorators

### Class Decorators

- `@ApiTags('Products')` - Groups endpoints in Swagger UI
- `@Controller('/products')` - Sets base path for controller
- `@ApiBearerAuth()` - Requires authentication for entire controller

### Method Decorators

- `@Get('/')`, `@Post('/')`, `@Put('/:id')`, `@Delete('/:id')` - HTTP methods
- `@ApiOperation({ summary, description })` - Endpoint documentation
- `@ApiOkResponse()`, `@ApiCreatedResponse()`, `@ApiBadRequestResponse()`, etc.

### Property Decorators

- `@ApiProperty({ description, example, type })` - Required property
- `@ApiPropertyOptional({ description, example, type })` - Optional property
- `@ApiPropertyArray(ItemType)` - Array properties

### Validation Decorators

- `@IsString()`, `@IsNumber()`, `@IsEmail()`, `@IsEnum()`
- `@IsOptional()`, `@Length(min, max)`, `@Min()`, `@Max()`
- `@Transform()`, `@Type()` - Data transformation

[↑ Back to Table of Contents](#-table-of-contents)

## 🔧 Generated Files

These files are automatically generated and should not be edited manually:

- `src/openapi.json` - OpenAPI specification
- `src/types/api.ts` - TypeScript type definitions
- `src/types/client.ts` - API client functions

[↑ Back to Table of Contents](#-table-of-contents)

## ⚠️ Important Notes

### ES Modules with .js Extensions

All imports use `.js` extensions for ES module compatibility:

```typescript
import { ApiProperty } from '@/decorators/index.js';
```

### Common Gotchas

- Controllers must be added to `scripts/generate-openapi-spec.ts` controllers array
- DTOs need both `@ApiProperty()` and validation decorators (`@IsString()`, etc.)
- Use `@Type(() => Number)` for query parameter type conversion
- Always export new controllers/DTOs in their respective index.ts files
- **Always run `npm run api:generate`** after creating or modifying routes/DTOs

### Development Tools

- **ESLint**: Code quality rules (warnings expected for template's `any` types)
- **Prettier**: Code formatting (runs separately from ESLint)
- **Husky**: Git hooks for automated checks
- **lint-staged**: Run tools only on staged files

[↑ Back to Table of Contents](#-table-of-contents)

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Safe error responses

[↑ Back to Table of Contents](#-table-of-contents)

## 🌐 API Documentation

The template automatically generates beautiful, interactive API documentation accessible at `/api/docs` when the server is running. Features include:

- **Interactive testing** - Test endpoints directly from the browser
- **Schema visualization** - See request/response structures
- **Authentication support** - Test protected endpoints
- **Example values** - Real examples for all fields
- **Export options** - Download OpenAPI spec

[↑ Back to Table of Contents](#-table-of-contents)

## ✅ Best Practices

1. **Always use validation decorators** on DTOs for type safety
2. **Include examples** in `@ApiProperty` for better documentation
3. **Use enum types** for fixed value sets
4. **Apply consistent error handling** with standard HTTP status codes
5. **Follow RESTful naming conventions** for endpoints
6. **Add security decorators** (`@ApiBearerAuth()`) for protected routes
7. **Use pagination** for list endpoints
8. **Implement comprehensive response documentation** with `@ApiResponse`
9. **Test endpoints** after implementation
10. **Run `npm run api:generate`** after any route/DTO changes

[↑ Back to Table of Contents](#-table-of-contents)

## 💡 Why This Template?

This template bridges the gap between Express.js simplicity and NestJS power by providing:

1. **Familiar Express patterns** with enhanced developer experience
2. **Automatic documentation** that stays in sync with your code
3. **Type safety** throughout the request/response cycle
4. **Industry best practices** built-in from day one
5. **Scalable architecture** that grows with your application

Perfect for building APIs that need to be well-documented, type-safe, and maintainable!

---

**Ready to build amazing APIs?** Start implementing your features with the decorator patterns above! 🎯
