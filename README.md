# 🚀 Express TypeScript OpenAPI Template

A modern, production-ready Express.js template with TypeScript, decorator-based OpenAPI/Swagger documentation, and comprehensive validation.

## 📋 Table of Contents

| Section                                               | Description                      |
| ----------------------------------------------------- | -------------------------------- |
| [✨ Features](#-features)                             | Core capabilities and tech stack |
| [🚀 Quick Start](#-quick-start)                       | Installation and setup           |
| [📁 Project Structure](#-project-structure)           | File organization                |
| [📋 Development Scripts](#-development-scripts)       | Development commands             |
| [🎯 Key Features Explained](#-key-features-explained) | Decorator patterns and examples  |
| [🔄 Development Workflows](#-development-workflows)   | Adding endpoints and workflows   |
| [🎨 Available Decorators](#-available-decorators)     | Complete decorator reference     |
| [🔧 Generated Files](#-generated-files)               | Auto-generated file overview     |
| [⚠️ Important Notes](#️-important-notes)               | Critical conventions and gotchas |
| [🔒 Security Features](#-security-features)           | Built-in security capabilities   |
| [🌐 API Documentation](#-api-documentation)           | Interactive docs and testing     |
| [✅ Best Practices](#-best-practices)                 | Implementation guidelines        |
| [💡 Why This Template?](#-why-this-template)          | Value proposition and benefits   |

## ✨ Features

[↑ Back to Table of Contents](#-table-of-contents)

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

## 🚀 Quick Start

[↑ Back to Table of Contents](#-table-of-contents)

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# View interactive API documentation
open http://localhost:3001/api/docs
```

## 📁 Project Structure

[↑ Back to Table of Contents](#-table-of-contents)

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
└── types/          # Generated types and schemas
```

## 📋 Development Scripts

[↑ Back to Table of Contents](#-table-of-contents)

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

## 🎯 Key Features Explained

[↑ Back to Table of Contents](#-table-of-contents)

### Decorator-Based Documentation

```typescript
@ApiTags('Products')
@Controller('/products')
export class ProductController {
  @Get('/')
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve a paginated list of products',
  })
  @ApiOkResponse({
    description: 'Products retrieved successfully',
    type: PaginatedResponseDto,
  })
  async getProducts(query: GetProductsQueryDto): Promise<void> {
    // Implementation
  }
}
```

### Automatic Type Generation

- **OpenAPI Spec**: Generated from decorators
- **TypeScript Types**: Auto-generated from DTOs
- **API Client**: Ready-to-use frontend client

### Validation with class-validator

```typescript
export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15',
    minLength: 1,
    maxLength: 200,
  })
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty({
    description: 'Product price',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;
}
```

## 🔄 Development Workflows

[↑ Back to Table of Contents](#-table-of-contents)

### Adding New Endpoints

1. **Create DTOs** with validation and OpenAPI decorators
2. **Implement Controller** with route decorators
3. **Export middleware** for route registration
4. **Add routes** to `src/routes/index.ts`
5. **Generate API artifacts** with `npm run api:generate`

### Typical Development Session

```bash
# Start development
npm run dev

# Make changes to controllers/DTOs
# API documentation updates automatically

# Generate types and client
npm run api:generate

# Validate everything
npm run test
```

## 🎨 Available Decorators

[↑ Back to Table of Contents](#-table-of-contents)

### Class Decorators

| Decorator              | Purpose             | Example                       |
| ---------------------- | ------------------- | ----------------------------- |
| `@Controller('/path')` | Define route prefix | `@Controller('/users')`       |
| `@ApiTags('Tag')`      | Group endpoints     | `@ApiTags('User Management')` |

### Method Decorators

| Decorator         | Purpose         | Example            |
| ----------------- | --------------- | ------------------ |
| `@Get('/')`       | GET endpoint    | `@Get('/search')`  |
| `@Post('/')`      | POST endpoint   | `@Post('/create')` |
| `@Put('/:id')`    | PUT endpoint    | `@Put('/:id')`     |
| `@Delete('/:id')` | DELETE endpoint | `@Delete('/:id')`  |

### Documentation Decorators

| Decorator                  | Purpose              | Example                                      |
| -------------------------- | -------------------- | -------------------------------------------- |
| `@ApiOperation()`          | Endpoint description | `@ApiOperation({ summary: 'Get users' })`    |
| `@ApiOkResponse()`         | 200 response         | `@ApiOkResponse({ type: UserDto })`          |
| `@ApiCreatedResponse()`    | 201 response         | `@ApiCreatedResponse({ type: UserDto })`     |
| `@ApiBadRequestResponse()` | 400 response         | `@ApiBadRequestResponse({ type: ErrorDto })` |
| `@ApiNotFoundResponse()`   | 404 response         | `@ApiNotFoundResponse()`                     |

### Property Decorators

| Decorator                | Purpose           | Example                                  |
| ------------------------ | ----------------- | ---------------------------------------- |
| `@ApiProperty()`         | Required property | `@ApiProperty({ example: 'John' })`      |
| `@ApiPropertyOptional()` | Optional property | `@ApiPropertyOptional({ type: String })` |

## 🔧 Generated Files

[↑ Back to Table of Contents](#-table-of-contents)

> **⚠️ Never edit generated files manually - they are overwritten on each build**

| File                  | Purpose                     | Generated By         |
| --------------------- | --------------------------- | -------------------- |
| `src/openapi.json`    | OpenAPI 3.0 specification   | `npm run api:spec`   |
| `src/types/api.ts`    | TypeScript type definitions | `npm run api:types`  |
| `src/types/client.ts` | API client functions        | `npm run api:client` |

## ⚠️ Important Notes

[↑ Back to Table of Contents](#-table-of-contents)

### ES Modules with .js Extensions

All imports must use `.js` extensions even for TypeScript files:

```typescript
import { ApiProperty } from '@/decorators/index.js'; // ✅ Correct
import { ApiProperty } from '@/decorators/index'; // ❌ Wrong
```

### Controller Pattern

Controllers must export middleware arrays for route registration:

```typescript
export const userRoutes = {
  getUsers: [
    ValidateQuery(GetUsersQueryDto),
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new UserController();
      await controller.getUsers(req.query as any, req, res, next);
    },
  ],
};
```

### DTO Validation Pattern

Always combine OpenAPI documentation with class-validator:

```typescript
@ApiProperty({ example: 'john@example.com', format: 'email' })
@IsEmail({}, { message: 'Must be a valid email' })
@Transform(({ value }) => value?.toLowerCase()?.trim())
email: string;
```

## 🔒 Security Features

[↑ Back to Table of Contents](#-table-of-contents)

- **Rate Limiting** - Configurable per-endpoint limits
- **CORS Protection** - Cross-origin request security
- **Helmet Security Headers** - Essential HTTP headers
- **Input Validation** - Request sanitization
- **JWT Authentication** - Token-based auth
- **Error Handling** - Secure error responses

## 🌐 API Documentation

[↑ Back to Table of Contents](#-table-of-contents)

Interactive Swagger UI is available at:

- **Development**: http://localhost:3001/api-docs
- **Production**: Your deployed domain + `/api-docs`

Features:

- Try endpoints directly in browser
- View request/response schemas
- Download OpenAPI specification
- Generate client code

## ✅ Best Practices

[↑ Back to Table of Contents](#-table-of-contents)

### DTO Design

- Use descriptive property names
- Include examples in `@ApiProperty`
- Combine validation with documentation
- Use enums for constrained values

### Controller Implementation

- Keep controllers thin - business logic in services
- Use proper HTTP status codes
- Handle errors gracefully
- Document all possible responses

### Type Safety

- Never use `any` type
- Leverage generated types
- Use proper TypeScript configurations
- Validate inputs and outputs

### API Design

- Follow RESTful conventions
- Use consistent naming
- Implement proper pagination
- Version your APIs appropriately

## 💡 Why This Template?

[↑ Back to Table of Contents](#-table-of-contents)

### 🎯 Developer Experience

- **Single Source of Truth**: Decorators generate docs, types, and validation
- **Type Safety**: End-to-end TypeScript with generated types
- **Hot Reload**: Instant feedback during development
- **Auto-completion**: Generated client provides IDE support

### 📚 Production Ready

- **Comprehensive Documentation**: Always up-to-date with code
- **Input Validation**: Automatic request/response validation
- **Security**: Built-in security best practices
- **Performance**: Rate limiting and optimized middleware

### 🔄 Maintainable

- **Consistent Patterns**: Clear conventions for adding features
- **Generated Code**: Reduces boilerplate and errors
- **Quality Gates**: Automated linting, formatting, and type checking
- **Modern Stack**: ES modules, latest TypeScript features

### 🚀 Scalable

- **Modular Architecture**: Easy to extend and modify
- **Database Agnostic**: Bring your own database solution
- **Deployment Ready**: Production build and configuration
- **Team Friendly**: Clear patterns for collaboration

---

**Ready to build amazing APIs?** 🎉

Start with `npm install && npm run dev` and visit http://localhost:3001/api-docs to explore your API!
