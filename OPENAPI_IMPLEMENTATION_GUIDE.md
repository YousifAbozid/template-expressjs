# OpenAPI/Swagger Implementation Guide for Express/TypeScript

This guide provides a comprehensive approach for implementing OpenAPI/Swagger documentation and type generation in an Express/TypeScript application, based on the patterns observed in this NestJS application.

## Overview

The goal is to achieve:

1. **Automatic API documentation generation**
2. **Type-safe request/response handling**
3. **Validation based on schemas**
4. **Client SDK generation capabilities**

## Dependencies

### Required Dependencies

```bash
npm install swagger-ui-express swagger-jsdoc @apidevtools/swagger-parser
npm install class-validator class-transformer reflect-metadata
npm install zod
```

### Development Dependencies

```bash
npm install -D @types/swagger-ui-express @types/swagger-jsdoc
```

## Core Architecture Pattern

### DTO (Data Transfer Object) Pattern

Create DTOs for all request/response objects with:

- Decorators or validation schemas for each property
- OpenAPI documentation annotations
- Support for nested objects and arrays
- Proper enum handling

### Controller Decoration Pattern

Implement a decorator-based system similar to NestJS:

```typescript
// Example target structure:
@ApiTags('Users')
@Controller('/users')
class UserController {
  @Get('/')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve paginated list of users',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: [UserResponseDto],
  })
  async getUsers(@Query() query: GetUsersQueryDto): Promise<UserResponseDto[]> {
    // Implementation
  }

  @Post('/')
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 201, type: UserResponseDto })
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    // Implementation
  }
}
```

## Key Features Implementation

### Swagger Configuration

```typescript
// In main.ts/app.ts
const swaggerConfig = {
  title: 'Your API Name',
  description: 'Your API description',
  version: '1.0.0',
  servers: [
    { url: 'http://localhost:3000', description: 'Development server' },
    { url: 'https://api.yourapp.com', description: 'Production server' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Setup Swagger UI
const document = SwaggerModule.createDocument(app, swaggerConfig);
SwaggerModule.setup('api', app, document);
```

### DTO Examples

#### Response DTO

```typescript
export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  fullName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.ADMIN,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
```

#### Request DTO

```typescript
export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    example: 'securePassword123',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER,
  })
  @IsEnum(UserRole)
  role: UserRole;
}
```

#### Pagination DTO

```typescript
export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    type: 'array',
  })
  records: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'Maximum page number',
    example: 10,
  })
  maxPage: number;
}

export class UserPaginationResponseDto extends PaginatedResponseDto<UserResponseDto> {
  @ApiProperty({
    description: 'Array of users',
    type: [UserResponseDto],
  })
  records: UserResponseDto[];
}
```

#### Query Parameters DTO

```typescript
export class GetUsersQueryDto {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiProperty({
    description: 'Search by name',
    example: 'john',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter by role',
    enum: UserRole,
    required: false,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
```

## Implementation Strategy

### 1. Create a Decorator System

Implement the following decorators using `reflect-metadata`:

#### API Documentation Decorators

```typescript
// @ApiProperty decorator for DTO properties
export function ApiProperty(options?: {
  description?: string;
  example?: any;
  enum?: any;
  type?: any;
  format?: string;
  required?: boolean;
  nullable?: boolean;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
}) {
  return function (target: any, propertyKey: string) {
    // Store metadata using reflect-metadata
    Reflect.defineMetadata('swagger:property', options, target, propertyKey);
  };
}

// @ApiOperation decorator for route methods
export function ApiOperation(options: {
  summary: string;
  description?: string;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata('swagger:operation', options, target, propertyKey);
  };
}

// @ApiResponse decorator for response documentation
export function ApiResponse(options: {
  status: number;
  description?: string;
  type?: any;
}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const existingResponses =
      Reflect.getMetadata('swagger:responses', target, propertyKey) || [];
    existingResponses.push(options);
    Reflect.defineMetadata(
      'swagger:responses',
      existingResponses,
      target,
      propertyKey
    );
  };
}

// @ApiTags decorator for controller grouping
export function ApiTags(...tags: string[]) {
  return function (target: any) {
    Reflect.defineMetadata('swagger:tags', tags, target);
  };
}

// @ApiBearerAuth decorator for authentication
export function ApiBearerAuth() {
  return function (target: any, propertyKey?: string) {
    if (propertyKey) {
      Reflect.defineMetadata(
        'swagger:security',
        [{ bearerAuth: [] }],
        target,
        propertyKey
      );
    } else {
      Reflect.defineMetadata('swagger:security', [{ bearerAuth: [] }], target);
    }
  };
}
```

#### Route Parameter Decorators

```typescript
// @Body decorator for request body
export function Body() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = { type: 'body' };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}

// @Query decorator for query parameters
export function Query() {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = { type: 'query' };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}

// @Param decorator for path parameters
export function Param(name?: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata('swagger:parameters', target, propertyKey) || [];
    existingParams[parameterIndex] = { type: 'param', name };
    Reflect.defineMetadata(
      'swagger:parameters',
      existingParams,
      target,
      propertyKey
    );
  };
}
```

### 2. Express Middleware Integration

#### Validation Middleware

```typescript
export function createValidationMiddleware(
  dtoClass: any,
  source: 'body' | 'query' | 'params' = 'body'
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToClass(dtoClass, req[source]);
      const errors = await validate(dto);

      if (errors.length > 0) {
        return res.status(400).json({
          message: 'Validation failed',
          errors: errors.map(error => ({
            field: error.property,
            constraints: error.constraints,
          })),
        });
      }

      req[source] = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}
```

#### Schema Generation Middleware

```typescript
export function generateOpenApiSpec(controllers: any[]) {
  const spec = {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  };

  // Process controllers and extract metadata
  controllers.forEach(controller => {
    const controllerMetadata = extractControllerMetadata(controller);
    // Build OpenAPI paths from metadata
  });

  return spec;
}
```

### 3. Error Handling

#### Standardized Error Response

```typescript
export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'VALIDATION_ERROR',
  })
  code: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Validation errors',
    required: false,
    type: 'array',
  })
  errors?: ValidationError[];

  @ApiProperty({
    description: 'Error timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  timestamp: string;
}

export class ValidationError {
  @ApiProperty({
    description: 'Field name',
    example: 'email',
  })
  field: string;

  @ApiProperty({
    description: 'Validation constraints',
    example: { isEmail: 'Must be a valid email address' },
  })
  constraints: Record<string, string>;
}
```

#### Global Error Handler

```typescript
export function globalErrorHandler(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorResponse: ErrorResponseDto = {
    message: error.message || 'Internal server error',
    code: error.code || 'INTERNAL_ERROR',
    statusCode: error.statusCode || 500,
    timestamp: new Date().toISOString(),
  };

  if (error.validationErrors) {
    errorResponse.errors = error.validationErrors;
  }

  res.status(errorResponse.statusCode).json(errorResponse);
}
```

## File Structure

```
src/
├── decorators/           # OpenAPI decorators
│   ├── api-property.decorator.ts
│   ├── api-operation.decorator.ts
│   ├── api-response.decorator.ts
│   ├── api-tags.decorator.ts
│   └── parameter.decorators.ts
├── dto/                  # Data Transfer Objects
│   ├── common/
│   │   ├── pagination.dto.ts
│   │   └── error-response.dto.ts
│   └── user/
│       ├── create-user.dto.ts
│       ├── update-user.dto.ts
│       ├── user-response.dto.ts
│       └── get-users-query.dto.ts
├── middleware/           # Validation and transformation middleware
│   ├── validation.middleware.ts
│   ├── transformation.middleware.ts
│   └── error.middleware.ts
├── controllers/          # Route controllers with decorators
│   └── user.controller.ts
├── swagger/              # Swagger configuration and generation
│   ├── swagger.config.ts
│   ├── schema-generator.ts
│   └── spec-builder.ts
├── types/                # Generated TypeScript types
│   ├── api.types.ts
│   └── generated/
├── utils/                # Helper functions for schema generation
│   ├── metadata.utils.ts
│   └── reflection.utils.ts
└── enums/                # Enum definitions
    └── user-role.enum.ts
```

## Build Process

### NPM Scripts

```json
{
  "scripts": {
    "dev": "nodemon src/app.ts",
    "build": "tsc && npm run generate:api-spec",
    "generate:api-spec": "ts-node scripts/generate-openapi-spec.ts",
    "generate:types": "openapi-generator-cli generate -i ./openapi.json -g typescript-axios -o ./src/types/generated",
    "swagger:validate": "swagger-codegen validate -i ./openapi.json",
    "start:swagger": "swagger-ui-serve ./openapi.json"
  }
}
```

### Schema Generation Script

```typescript
// scripts/generate-openapi-spec.ts
import { generateOpenApiSpec } from '../src/swagger/schema-generator';
import { UserController } from '../src/controllers/user.controller';
import fs from 'fs';

const controllers = [UserController];
const spec = generateOpenApiSpec(controllers);

fs.writeFileSync('./openapi.json', JSON.stringify(spec, null, 2));
console.log('OpenAPI specification generated successfully!');
```

## Advanced Features

### Enum Documentation

```typescript
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}

// In DTO:
@ApiProperty({
  description: 'User role',
  enum: UserRole,
  enumName: 'UserRole',
  example: UserRole.USER
})
role: UserRole;
```

### File Upload Support

```typescript
export class FileUploadDto {
  @ApiProperty({
    description: 'Uploaded file',
    type: 'string',
    format: 'binary'
  })
  file: Express.Multer.File;
}

// In controller:
@Post('/upload')
@ApiOperation({ summary: 'Upload file' })
@ApiConsumes('multipart/form-data')
@ApiResponse({ status: 201, description: 'File uploaded successfully' })
async uploadFile(@UploadedFile() file: FileUploadDto) {
  // Implementation
}
```

### Nested Objects and Arrays

```typescript
export class AddressDto {
  @ApiProperty({ description: 'Street address' })
  street: string;

  @ApiProperty({ description: 'City name' })
  city: string;

  @ApiProperty({ description: 'Country name' })
  country: string;
}

export class CreateUserWithAddressDto extends CreateUserDto {
  @ApiProperty({
    description: 'User address',
    type: AddressDto,
  })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({
    description: 'User hobbies',
    type: [String],
    example: ['reading', 'gaming'],
  })
  @IsArray()
  @IsString({ each: true })
  hobbies: string[];
}
```

## Integration Examples

### Express App Setup

```typescript
// app.ts
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenApiSpec } from './swagger/schema-generator';
import { UserController } from './controllers/user.controller';
import { globalErrorHandler } from './middleware/error.middleware';

const app = express();

// Generate OpenAPI spec
const controllers = [UserController];
const openApiSpec = generateOpenApiSpec(controllers);

// Serve Swagger documentation
app.use('/api', swaggerUi.serve, swaggerUi.setup(openApiSpec));

// Apply global error handler
app.use(globalErrorHandler);

export default app;
```

### Controller Implementation Example

```typescript
// controllers/user.controller.ts
@ApiTags('Users')
@Controller('/users')
export class UserController {
  @Get('/')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a paginated list of users with optional filtering',
  })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    type: UserPaginationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
    type: ErrorResponseDto,
  })
  async getUsers(
    @Query() query: GetUsersQueryDto
  ): Promise<UserPaginationResponseDto> {
    // Implementation
    return await this.userService.getUsers(query);
  }

  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user account with the provided details',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserResponseDto> {
    return await this.userService.createUser(createUserDto);
  }
}
```

## Expected Deliverables

1. ✅ **Complete decorator system** for OpenAPI documentation
2. ✅ **DTO classes** with validation and documentation
3. ✅ **Express middleware** for automatic validation
4. ✅ **Swagger UI integration** at `/api` endpoint
5. ✅ **Type generation** scripts and workflows
6. ✅ **Example controllers** demonstrating all features
7. ✅ **Build scripts** for development and production
8. ✅ **Error handling** with standardized responses
9. ✅ **File structure** and organization guidelines
10. ✅ **Advanced features** (enums, nested objects, file uploads)

## Getting Started

1. **Install dependencies** as listed above
2. **Create the file structure** as outlined
3. **Implement the decorator system** starting with basic decorators
4. **Create your first DTOs** following the examples
5. **Set up validation middleware** for request processing
6. **Configure Swagger UI** in your Express app
7. **Build your first controller** with full documentation
8. **Test the API documentation** at `/api` endpoint

This implementation will provide the same level of API documentation and type safety as the reference NestJS application while maintaining Express's flexibility and simplicity.
