import { ApiProperty, ApiPropertyOptional } from '@/decorators/index.js';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'Array of items',
    type: 'array',
  })
  records: T[];

  @ApiProperty({
    description: 'Total number of items',
    example: 100,
    type: Number,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
    type: Number,
  })
  page: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    type: Number,
  })
  limit: number;

  @ApiProperty({
    description: 'Maximum page number',
    example: 10,
    type: Number,
  })
  maxPage: number;

  @ApiPropertyOptional({
    description: 'URL to next page',
    example: '/api/users?page=2&limit=10',
    type: String,
  })
  nextPage?: string;

  @ApiPropertyOptional({
    description: 'URL to previous page',
    example: '/api/users?page=1&limit=10',
    type: String,
  })
  previousPage?: string;

  constructor(
    records: T[],
    total: number,
    page: number,
    limit: number,
    baseUrl?: string
  ) {
    this.records = records;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.maxPage = Math.ceil(total / limit);

    if (baseUrl) {
      if (page < this.maxPage) {
        this.nextPage = `${baseUrl}?page=${page + 1}&limit=${limit}`;
      }
      if (page > 1) {
        this.previousPage = `${baseUrl}?page=${page - 1}&limit=${limit}`;
      }
    }
  }
}

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number',
    example: 1,
    minimum: 1,
    type: Number,
  })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  limit?: number = 10;
}
