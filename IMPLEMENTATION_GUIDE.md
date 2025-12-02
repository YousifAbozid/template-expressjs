# 🚀 Implementation Guide: Adding New Routes & Features

This guide shows developers (including AI agents) how to implement new features following the established OpenAPI patterns in this Express TypeScript template.

## 🏗️ Architecture Overview

This template uses a decorator-based approach similar to NestJS but optimized for Express.js:

```
src/
├── controllers/     # API route handlers with decorators
├── dto/            # Data Transfer Objects with validation
├── enums/          # Enum definitions
├── decorators/     # OpenAPI decorators (@ApiProperty, @ApiOperation, etc.)
├── middleware/     # Validation and error handling
├── swagger/        # OpenAPI schema generation
└── routes/         # Express route registration
```

## 🎯 Step-by-Step Implementation

### Step 1: Create Enums (if needed)

Create enums for your domain:

```typescript
// src/enums/product-status.enum.ts
export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

// src/enums/product-category.enum.ts
export enum ProductCategory {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  BOOKS = 'books',
}

// Export in src/enums/index.ts
export * from './product-status.enum.js';
export * from './product-category.enum.js';
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
    example: 'prod_123456789',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'iPhone 15 Pro',
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
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
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
    example: 'iPhone 15 Pro',
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

#### Update DTO

```typescript
// src/dto/product/update-product.dto.ts
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Length,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@/decorators/index.js';
import { ProductCategory, ProductStatus } from '@/enums/index.js';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Product name',
    example: 'iPhone 15 Pro Max',
    minLength: 1,
    maxLength: 200,
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Product name must be a string' })
  @Length(1, 200, {
    message: 'Product name must be between 1 and 200 characters',
  })
  @Transform(({ value }) => value?.trim())
  name?: string;

  @ApiPropertyOptional({
    description: 'Product price in USD',
    example: 1199.99,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be positive' })
  price?: number;

  @ApiPropertyOptional({
    description: 'Product category',
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
    description: 'Product status',
    enum: ProductStatus,
    enumName: 'ProductStatus',
    example: ProductStatus.ACTIVE,
  })
  @IsOptional()
  @IsEnum(ProductStatus, { message: 'Status must be a valid product status' })
  status?: ProductStatus;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Updated product description',
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

  @ApiPropertyOptional({
    description: 'Sort by field',
    example: 'createdAt',
    enum: ['createdAt', 'updatedAt', 'name', 'price'],
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Sort field must be a string' })
  sortBy?: 'createdAt' | 'updatedAt' | 'name' | 'price' = 'createdAt';

  @ApiPropertyOptional({
    description: 'Sort order',
    example: 'desc',
    enum: ['asc', 'desc'],
    type: String,
  })
  @IsOptional()
  @IsString({ message: 'Sort order must be a string' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
```

#### Pagination Response DTO

```typescript
// src/dto/product/product-pagination-response.dto.ts
import { ProductResponseDto } from './product-response.dto.js';
import { PaginatedResponseDto } from '@/dto/common/index.js';
import { ApiProperty } from '@/decorators/index.js';

export class ProductPaginationResponseDto extends PaginatedResponseDto<ProductResponseDto> {
  @ApiProperty({
    description: 'Array of products',
    type: [ProductResponseDto],
    isArray: true,
  })
  records: ProductResponseDto[];

  constructor(
    products: ProductResponseDto[],
    total: number,
    page: number,
    limit: number,
    baseUrl?: string
  ) {
    super(products, total, page, limit, baseUrl);
    this.records = products;
  }
}
```

#### Export DTOs

```typescript
// src/dto/product/index.ts
export * from './product-response.dto.js';
export * from './create-product.dto.js';
export * from './update-product.dto.js';
export * from './get-products-query.dto.js';
export * from './product-pagination-response.dto.js';

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
  ApiBearerAuth,
  Controller,
  Get,
  Post,
  Put,
  Delete
} from '@/decorators/index.js';
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
  GetProductsQueryDto,
  ProductPaginationResponseDto
} from '@/dto/product/index.js';
import {
  ErrorResponseDto,
  SuccessResponseDto
} from '@/dto/common/index.js';
import { ProductStatus, ProductCategory } from '@/enums/index.js';
import { ValidateBody, ValidateQuery } from '@/middleware/validator.js';

// Mock data for demonstration
const mockProducts: ProductResponseDto[] = [
  new ProductResponseDto({
    id: 'prod_001',
    name: 'iPhone 15 Pro',
    price: 999.99,
    category: ProductCategory.ELECTRONICS,
    status: ProductStatus.ACTIVE,
    description: 'Latest iPhone with advanced features',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }),
  new ProductResponseDto({
    id: 'prod_002',
    name: 'MacBook Pro',
    price: 1999.99,
    category: ProductCategory.ELECTRONICS,
    status: ProductStatus.ACTIVE,
    description: 'Powerful laptop for professionals',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02')
  })
];

@ApiTags('Products')
@Controller('/products')
export class ProductController {

  @Get('/')
  @ApiOperation({
    summary: 'Get all products',
    description: 'Retrieve a paginated list of products with optional filtering and searching'
  })
  @ApiOkResponse({
    description: 'Products retrieved successfully',
    type: ProductPaginationResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters'
  })
  async getProducts(
    query: GetProductsQueryDto,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        status,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = query;

      let filteredProducts = [...mockProducts];

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
          product.name.toLowerCase().includes(searchLower)
        );
      }

      // Apply category filter
      if (category) {
        filteredProducts = filteredProducts.filter(product => product.category === category);
      }

      // Apply status filter
      if (status) {
        filteredProducts = filteredProducts.filter(product => product.status === status);
      }

      // Apply sorting
      filteredProducts.sort((a, b) => {
        const aValue = a[sortBy as keyof ProductResponseDto];
        const bValue = b[sortBy as keyof ProductResponseDto];

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      // Apply pagination
      const total = filteredProducts.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

      const result = new ProductPaginationResponseDto(
        paginatedProducts,
        total,
        page,
        limit,
        \`\${req.baseUrl}\${req.path}\`
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get product by ID',
    description: 'Retrieve a specific product by its unique identifier'
  })
  @ApiOkResponse({
    description: 'Product retrieved successfully',
    type: ProductResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Product not found'
  })
  async getProductById(
    id: string,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const product = mockProducts.find(p => p.id === id);

      if (!product) {
        const errorResponse = new ErrorResponseDto(
          'Product not found',
          'PRODUCT_NOT_FOUND',
          404,
          req.path
        );
        return res.status(404).json(errorResponse);
      }

      res.json(product);
    } catch (error) {
      next(error);
    }
  }

  @Post('/')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product with the provided details'
  })
  @ApiCreatedResponse({
    description: 'Product created successfully',
    type: ProductResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Invalid product data'
  })
  async createProduct(
    createProductDto: CreateProductDto,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      // Create new product
      const newProduct = new ProductResponseDto({
        id: \`prod_\${Date.now()}\`,
        name: createProductDto.name,
        price: createProductDto.price,
        category: createProductDto.category,
        status: ProductStatus.ACTIVE,
        description: createProductDto.description,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      mockProducts.push(newProduct);

      res.status(201).json(newProduct);
    } catch (error) {
      next(error);
    }
  }

  @Put('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update product',
    description: 'Update an existing product\'s information'
  })
  @ApiOkResponse({
    description: 'Product updated successfully',
    type: ProductResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Product not found'
  })
  @ApiBadRequestResponse({
    description: 'Invalid product data'
  })
  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productIndex = mockProducts.findIndex(p => p.id === id);

      if (productIndex === -1) {
        const errorResponse = new ErrorResponseDto(
          'Product not found',
          'PRODUCT_NOT_FOUND',
          404,
          req.path
        );
        return res.status(404).json(errorResponse);
      }

      // Update product
      const currentProduct = mockProducts[productIndex];
      const updatedProduct = new ProductResponseDto({
        ...currentProduct,
        ...updateProductDto,
        updatedAt: new Date()
      });

      mockProducts[productIndex] = updatedProduct;

      res.json(updatedProduct);
    } catch (error) {
      next(error);
    }
  }

  @Delete('/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete product',
    description: 'Delete a product (soft delete by setting status to inactive)'
  })
  @ApiOkResponse({
    description: 'Product deleted successfully',
    type: SuccessResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Product not found'
  })
  async deleteProduct(
    id: string,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const productIndex = mockProducts.findIndex(p => p.id === id);

      if (productIndex === -1) {
        const errorResponse = new ErrorResponseDto(
          'Product not found',
          'PRODUCT_NOT_FOUND',
          404,
          req.path
        );
        return res.status(404).json(errorResponse);
      }

      // Soft delete by setting status to inactive
      mockProducts[productIndex].status = ProductStatus.INACTIVE;
      mockProducts[productIndex].updatedAt = new Date();

      const successResponse = new SuccessResponseDto('Product deleted successfully');
      res.json(successResponse);
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
    }
  ],
  getProductById: [
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new ProductController();
      await controller.getProductById(req.params.id, req, res, next);
    }
  ],
  createProduct: [
    ValidateBody(CreateProductDto),
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new ProductController();
      await controller.createProduct(req.body, req, res, next);
    }
  ],
  updateProduct: [
    ValidateBody(UpdateProductDto),
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new ProductController();
      await controller.updateProduct(req.params.id, req.body, req, res, next);
    }
  ],
  deleteProduct: [
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new ProductController();
      await controller.deleteProduct(req.params.id, req, res, next);
    }
  ]
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
router.put('/products/:id', ...productRoutes.updateProduct);
router.delete('/products/:id', ...productRoutes.deleteProduct);
```

### Step 5: Update Schema Generation

```typescript
// In src/swagger/spec-builder.ts, add your DTOs to generateComponentSchemas():
import {
  ProductResponseDto,
  CreateProductDto,
  UpdateProductDto,
  GetProductsQueryDto,
  ProductPaginationResponseDto,
} from '@/dto/product/index.js';
import { ProductStatus, ProductCategory } from '@/enums/index.js';

function generateComponentSchemas(): Record<string, OpenApiSchema> {
  const schemas: Record<string, OpenApiSchema> = {};

  // Product DTOs
  schemas.ProductResponseDto = generateSchemaFromClass(ProductResponseDto);
  schemas.CreateProductDto = generateSchemaFromClass(CreateProductDto);
  schemas.UpdateProductDto = generateSchemaFromClass(UpdateProductDto);
  schemas.GetProductsQueryDto = generateSchemaFromClass(GetProductsQueryDto);
  schemas.ProductPaginationResponseDto = generateSchemaFromClass(
    ProductPaginationResponseDto
  );

  // Product Enums
  schemas.ProductStatus = {
    type: 'string',
    enum: Object.values(ProductStatus),
    description: 'Available product statuses',
  };

  schemas.ProductCategory = {
    type: 'string',
    enum: Object.values(ProductCategory),
    description: 'Available product categories',
  };

  // Common DTOs
  schemas.ErrorResponseDto = generateSchemaFromClass(ErrorResponseDto);
  schemas.ValidationErrorDto = generateSchemaFromClass(ValidationErrorDto);
  schemas.SuccessResponseDto = generateSchemaFromClass(SuccessResponseDto);
  schemas.PaginationQueryDto = generateSchemaFromClass(PaginationQueryDto);

  return schemas;
}
```

### Step 6: Update Generation Script

```typescript
// In scripts/generate-openapi-spec.ts:
import { ProductController } from '../src/controllers/index.js';

const controllers = [ProductController];
```

### Step 7: Generate & Test

```bash
# Generate OpenAPI specification
npm run generate:api-spec

# Validate the specification
npm run validate:api-spec

# Start development server
npm run dev

# Test your endpoints
curl "http://localhost:3001/api/products"
curl -X POST http://localhost:3001/api/products -H "Content-Type: application/json" -d '{"name":"Test Product","price":99.99,"category":"electronics"}'
```

## 🎨 Available Decorators

### Class Decorators

- `@ApiTags('Products')` - Groups endpoints in Swagger UI
- `@Controller('/products')` - Sets base path for controller
- `@ApiBearerAuth()` - Requires authentication for entire controller

### Method Decorators

- `@Get('/')`, `@Post('/')`, `@Put('/:id')`, `@Delete('/:id')` - HTTP methods
- `@ApiOperation({ summary, description })` - Endpoint documentation
- `@ApiResponse({ status, description, type })` - Response documentation
- `@ApiOkResponse()`, `@ApiCreatedResponse()`, `@ApiBadRequestResponse()`, etc.

### Property Decorators

- `@ApiProperty({ description, example, type })` - Required property
- `@ApiPropertyOptional({ description, example, type })` - Optional property
- `@ApiPropertyArray(ItemType)` - Array properties

### Validation Decorators

- `@IsString()`, `@IsNumber()`, `@IsEmail()`, `@IsEnum()`
- `@IsOptional()`, `@Length(min, max)`, `@Min()`, `@Max()`
- `@Transform()`, `@Type()`

## 🔧 Available Scripts

```bash
npm run dev                    # Start development with hot reload
npm run generate:api-spec      # Generate OpenAPI spec from decorators
npm run validate:api-spec      # Validate generated OpenAPI spec
npm run generate:types         # Generate TypeScript types
npm run generate:client        # Generate API client
npm run api:generate-all       # Generate all (spec + types + client)
```

## ✅ Best Practices

1. **Always use validation decorators** on DTOs for type safety
2. **Include examples** in `@ApiProperty` for better documentation
3. **Use enum types** for fixed value sets
4. **Apply consistent error handling** with standard HTTP status codes
5. **Follow RESTful naming conventions** for endpoints
6. **Add security decorators** (`@ApiBearerAuth()`) for protected routes
7. **Use pagination** for list endpoints
8. **Implement soft deletes** when appropriate
9. **Include comprehensive response documentation** with `@ApiResponse`
10. **Test endpoints** after implementation

## 🚨 Common Gotchas

- Ensure `experimentalDecorators: true` in tsconfig.json
- Import with `.js` extensions for ES modules
- Use `@Type(() => Number)` for query parameter type conversion
- Always call `next(error)` in catch blocks
- Remember to export new controllers in `src/controllers/index.ts`
- Update schema generation when adding new DTOs
- Add new controller to generation script

## 📚 Example API Documentation

After following this guide, your Swagger UI at `/api/docs` will include:

- **Complete API schemas** with examples
- **Request/response documentation**
- **Interactive testing interface**
- **Authentication requirements**
- **Validation constraints**
- **Error response formats**

This template provides a solid foundation for building scalable, well-documented APIs with Express and TypeScript! 🎯
