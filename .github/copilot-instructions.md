# GitHub Copilot Instructions

## Project Overview

This is a modern **Express TypeScript OpenAPI template** with decorator-based architecture inspired by NestJS but optimized for Express.js. The core innovation is automatic OpenAPI/Swagger documentation generation from TypeScript decorators.

## Complete Implementation Guide

### Step 1: Create Enums (if needed)

```typescript
// src/enums/product-category.enum.ts
export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
}

// src/enums/product-status.enum.ts
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

// Export in src/enums/index.ts
export * from './product-category.enum.js';
export * from './product-status.enum.js';
```

### Step 2: Create DTOs with Validation

#### Response DTO

```typescript
// src/dto/product/product-response.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@/decorators/index.js';
import { ProductStatus, ProductCategory } from '@/enums/index.js';

export class ProductResponseDto {
  @ApiProperty({
    description: 'Product ID',
    example: 'prod_123',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 999.99,
    type: Number,
  })
  price: number;

  @ApiProperty({
    description: 'Product category',
    enum: ProductCategory,
    enumName: 'ProductCategory',
    example: ProductCategory.ELECTRONICS,
  })
  category: ProductCategory;

  @ApiProperty({
    description: 'Product status',
    enum: ProductStatus,
    enumName: 'ProductStatus',
    example: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest iPhone with advanced features',
    type: String,
  })
  description?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-01T00:00:00Z',
    type: String,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00Z',
    type: String,
  })
  updatedAt: Date;

  constructor(partial: Partial<ProductResponseDto>) {
    Object.assign(this, partial);
  }
}
```

#### Create DTO

```typescript
// src/dto/product/create-product.dto.ts
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@/decorators/index.js';
import { ProductCategory } from '@/enums/index.js';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro Max',
    minLength: 1,
    maxLength: 200,
    type: String,
  })
  @IsString({ message: 'Product name must be a string' })
  @Length(1, 200, {
    message: 'Product name must be between 1 and 200 characters',
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @ApiProperty({
    description: 'Product price in USD',
    example: 999.99,
    minimum: 0,
    type: Number,
  })
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be positive' })
  price: number;

  @ApiProperty({
    description: 'Product category',
    enum: ProductCategory,
    enumName: 'ProductCategory',
    example: ProductCategory.ELECTRONICS,
  })
  @IsEnum(ProductCategory, {
    message: 'Category must be a valid product category',
  })
  category: ProductCategory;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Latest iPhone with advanced features',
    maxLength: 1000,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @Length(0, 1000, {
    message: 'Description must be no more than 1000 characters',
  })
  @Transform(({ value }) => value?.trim())
  description?: string;
}
```

#### Query DTO

```typescript
// src/dto/product/get-products-query.dto.ts
import {
  IsOptional,
  IsNumber,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@/decorators/index.js';
import { ProductCategory, ProductStatus } from '@/enums/index.js';

export class GetProductsQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Page must be a number' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Limit must be a number' })
  @Min(1, { message: 'Limit must be at least 1' })
  @Max(100, { message: 'Limit must be at most 100' })
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Search by product name',
    example: 'iPhone',
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Search term must be a string' })
  @Transform(({ value }) => value?.trim())
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category',
    enum: ProductCategory,
    enumName: 'ProductCategory',
    example: ProductCategory.ELECTRONICS,
  })
  @IsOptional()
  @IsEnum(ProductCategory, {
    message: 'Category must be a valid product category',
  })
  category?: ProductCategory;

  @ApiPropertyOptional({
    description: 'Filter by status',
    enum: ProductStatus,
    enumName: 'ProductStatus',
    example: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be a valid product status' })
  status?: ProductStatus;
}
```

#### Export DTOs

```typescript
// src/dto/product/index.ts
export * from './product-response.dto.js';
export * from './create-product.dto.js';
export * from './update-product.dto.js';
export * from './get-products-query.dto.js';

// Add to src/dto/index.ts
export * from './product/index.js';
```

### Step 3: Create Controller

```typescript
// src/controllers/product.controller.ts
import { Request, Response, NextFunction } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  Controller,
  Get,
  Post,
  Put,
  Delete,
} from '@/decorators/index.js';
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
  GetProductsQueryDto,
} from '@/dto/product/index.js';
import {
  ErrorResponseDto,
  SuccessResponseDto,
  PaginatedResponseDto,
} from '@/dto/common/index.js';
import { ProductStatus, ProductCategory } from '@/enums/index.js';
import { ValidateBody, ValidateQuery } from '@/middleware/validator.js';

@ApiTags('Products')
@Controller('/products')
export class ProductController {
  @Get('/')
  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieve a paginated list of products with optional filtering and searching',
  })
  @ApiOkResponse({
    description: 'Products retrieved successfully',
    type: PaginatedResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
    type: ErrorResponseDto,
  })
  async getProducts(
    query: GetProductsQueryDto,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Mock implementation - replace with your business logic
      const products: ProductResponseDto[] = [
        new ProductResponseDto({
          id: 'prod_001',
          name: 'iPhone 15 Pro',
          price: 999.99,
          category: ProductCategory.ELECTRONICS,
          status: ProductStatus.ACTIVE,
          description: 'Latest iPhone model',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      const response = new PaginatedResponseDto(
        products,
        1,
        query.page || 1,
        query.limit || 10
      );

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  @Post('/')
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product with the provided information',
  })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid product data',
    type: ErrorResponseDto,
  })
  async createProduct(
    body: CreateProductDto,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Mock implementation - replace with your business logic
      const product = new ProductResponseDto({
        id: 'prod_' + Date.now(),
        ...body,
        status: ProductStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a single product by its unique identifier',
  })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: ErrorResponseDto,
  })
  async getProductById(
    id: string,
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Mock implementation - replace with your business logic
      const product = new ProductResponseDto({
        id,
        name: 'iPhone 15 Pro',
        price: 999.99,
        category: ProductCategory.ELECTRONICS,
        status: ProductStatus.ACTIVE,
        description: 'Latest iPhone model',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
}

// Export middleware functions for route setup
export const productRoutes = {
  getProducts: [
    ValidateQuery(GetProductsQueryDto),
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new ProductController();
      await controller.getProducts(req.query as any, req, res, next);
    },
  ],
  createProduct: [
    ValidateBody(CreateProductDto),
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new ProductController();
      await controller.createProduct(req.body, req, res, next);
    },
  ],
  getProductById: [
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new ProductController();
      await controller.getProductById(req.params.id, req, res, next);
    },
  ],
};

// Export in src/controllers/index.ts
export * from './product.controller.js';
```

### Step 4: Add Routes

```typescript
// In src/routes/index.ts, add your routes:
import { productRoutes } from '@/controllers/product.controller.js';

// Product routes
router.get('/products', ...productRoutes.getProducts);
router.get('/products/:id', ...productRoutes.getProductById);
router.post('/products', ...productRoutes.createProduct);
```

### Step 5: Update Generation Script

```typescript
// In scripts/generate-openapi-spec.ts:
import { ProductController } from '../src/controllers/index.js';

const controllers = [ProductController];
```

### Step 6: Generate & Test

```bash
# Generate OpenAPI specification
npm run api:generate

# Start development server
npm run dev

# Test your endpoints
curl "http://localhost:3001/api/products"
curl -X POST http://localhost:3001/api/products -H "Content-Type: application/json" -d '{"name":"Test Product","price":99.99,"category":"electronics"}'
```

## Critical Conventions

### ES Modules with .js Extensions

```typescript
import { ApiProperty } from '@/decorators/index.js';
```

### DTO Pattern

Always combine OpenAPI documentation with validation:

```typescript
@ApiProperty({ example: 'iPhone 15', minLength: 1, maxLength: 200 })
@IsString()
@Length(1, 200)
name: string;
```

### Route Middleware Pattern

```typescript
export const productRoutes = {
  createProduct: [
    ValidateBody(CreateProductDto),
    async (req, res, next) =>
      new ProductController().createProduct(req.body, req, res, next),
  ],
};
```

### Required Steps After Implementation

1. Add controller to `scripts/generate-openapi-spec.ts` controllers array
2. Export DTOs in their respective index.ts files
3. Export controller in `src/controllers/index.ts`
4. Run `npm run api:generate` to generate OpenAPI spec, types, and client
5. Use `@Type(() => Number)` for query parameter type conversion

### Generated Files (Never Edit)

- `src/openapi.json` - OpenAPI specification
- `src/types/api.ts` - TypeScript types
- `src/types/client.ts` - API client functions

This guide provides everything needed to implement new features in one prompt!
