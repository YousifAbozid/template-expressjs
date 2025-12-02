# 🚀 Express TypeScript OpenAPI Template

A modern, production-ready Express.js template with TypeScript, decorator-based OpenAPI/Swagger documentation, and comprehensive validation.

## 📧 Support & Repository

- **Email**: yousif.abozid@yahoo.com
- **Repository**: https://github.com/YousifAbozid/template-express-ts

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

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# View interactive API documentation
open http://localhost:3001/api/docs

# Generate OpenAPI specification
npm run generate:api-spec
```

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

## 🛠️ Available Scripts

```bash
npm run dev                    # Development server with hot reload
npm run build                  # Build for production
npm start                     # Start production server
npm run generate:api-spec      # Generate OpenAPI spec from decorators
npm run validate:api-spec      # Validate generated specification
npm run generate:types         # Generate TypeScript types from schema
npm run generate:client        # Generate API client from schema
npm run api:generate-all       # Generate all (spec + types + client)
```

## 📖 Getting Started

1. **Clone the template**:

   ```bash
   git clone https://github.com/YousifAbozid/template-express-ts.git
   cd template-express-ts
   npm install
   ```

2. **Start development**:

   ```bash
   npm run dev
   ```

3. **Implement your features**:
   - Follow the [Implementation Guide](./IMPLEMENTATION_GUIDE.md) for step-by-step instructions
   - See examples in the guide for creating controllers, DTOs, and routes

4. **View your API**:
   - Interactive docs: `http://localhost:3001/api/docs`
   - Raw OpenAPI spec: `http://localhost:3001/api/docs.json`

## 🎯 Key Features Explained

### Decorator-Based Documentation

```typescript
@ApiTags('Products')
@Controller('/products')
export class ProductController {
  @Get('/')
  @ApiOperation({ summary: 'Get all products' })
  @ApiOkResponse({ type: ProductPaginationResponseDto })
  async getProducts() {
    // Implementation
  }
}
```

### Automatic Validation

```typescript
export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15' })
  @IsString()
  @Length(1, 200)
  name: string;

  @ApiProperty({ example: 999.99 })
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

## 📋 Implementation Guide

This template includes a comprehensive [Implementation Guide](./IMPLEMENTATION_GUIDE.md) that shows you how to:

- ✅ Create new controllers with decorators
- ✅ Build DTOs with validation
- ✅ Set up routes with middleware
- ✅ Generate OpenAPI documentation
- ✅ Handle authentication & authorization
- ✅ Implement pagination & filtering
- ✅ Follow best practices

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **JWT Authentication** - Secure token-based auth
- **Input Validation** - Comprehensive request validation
- **Error Handling** - Safe error responses

## 🌐 API Documentation

The template automatically generates beautiful, interactive API documentation accessible at `/api/docs` when the server is running. Features include:

- **Interactive testing** - Test endpoints directly from the browser
- **Schema visualization** - See request/response structures
- **Authentication support** - Test protected endpoints
- **Example values** - Real examples for all fields
- **Export options** - Download OpenAPI spec

## 💡 Why This Template?

This template bridges the gap between Express.js simplicity and NestJS power by providing:

1. **Familiar Express patterns** with enhanced developer experience
2. **Automatic documentation** that stays in sync with your code
3. **Type safety** throughout the request/response cycle
4. **Industry best practices** built-in from day one
5. **Scalable architecture** that grows with your application

Perfect for building APIs that need to be well-documented, type-safe, and maintainable!

---

**Ready to build amazing APIs?** Check out the [Implementation Guide](./IMPLEMENTATION_GUIDE.md) and start coding! 🎯
