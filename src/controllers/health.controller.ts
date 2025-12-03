import type { Request, Response, NextFunction } from 'express';
import type { HealthResponse } from '@/types/index.js';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiServiceUnavailableResponse,
} from '@/decorators/index.js';
import { Controller, Get } from '@/decorators/index.js';

@ApiTags('Health')
@Controller('/health')
export class HealthController {
  @Get('/')
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns the current status and uptime of the API server',
  })
  @ApiOkResponse({
    description: 'API is operational',
  })
  @ApiServiceUnavailableResponse({
    description: 'Service unavailable',
  })
  async healthCheck(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response: HealthResponse = {
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

// Export route handlers for Express router
export const healthRoutes = {
  healthCheck: [
    async (req: Request, res: Response, next: NextFunction) => {
      const controller = new HealthController();
      await controller.healthCheck(req, res, next);
    },
  ],
};
