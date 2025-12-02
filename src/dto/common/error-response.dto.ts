import { ApiProperty, ApiPropertyOptional } from '@/decorators/index.js';

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
    type: String,
  })
  message: string;

  @ApiProperty({
    description: 'Error code',
    example: 'VALIDATION_ERROR',
    type: String,
  })
  code: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
    type: Number,
  })
  statusCode: number;

  @ApiPropertyOptional({
    description: 'Validation errors',
    type: 'array',
    items: {
      type: Object,
    },
  })
  errors?: ValidationErrorDto[];

  @ApiProperty({
    description: 'Error timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  timestamp: string;

  @ApiPropertyOptional({
    description: 'Request path that caused the error',
    example: '/api/users',
    type: String,
  })
  path?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number,
    path?: string,
    errors?: ValidationErrorDto[]
  ) {
    this.message = message;
    this.code = code;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    this.path = path;
    this.errors = errors;
  }
}

export class ValidationErrorDto {
  @ApiProperty({
    description: 'Field name that failed validation',
    example: 'email',
    type: String,
  })
  field: string;

  @ApiProperty({
    description: 'Validation constraints that were violated',
    example: { isEmail: 'Must be a valid email address' },
    type: Object,
  })
  constraints: Record<string, string>;

  @ApiPropertyOptional({
    description: 'The value that failed validation',
    example: 'invalid-email',
    type: String,
  })
  value?: any;

  constructor(field: string, constraints: Record<string, string>, value?: any) {
    this.field = field;
    this.constraints = constraints;
    this.value = value;
  }
}

export class SuccessResponseDto<T = any> {
  @ApiProperty({
    description: 'Success status',
    example: true,
    type: Boolean,
  })
  success: boolean;

  @ApiProperty({
    description: 'Success message',
    example: 'Operation completed successfully',
    type: String,
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Response data',
  })
  data?: T;

  @ApiProperty({
    description: 'Response timestamp',
    example: '2024-01-01T00:00:00.000Z',
    type: String,
  })
  timestamp: string;

  constructor(message: string, data?: T) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
