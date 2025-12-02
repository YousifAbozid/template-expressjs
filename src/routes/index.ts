import { Router } from 'express';
import type { Request, Response } from 'express';
import type { HealthResponse } from '@/types';

const router = Router();

/**
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current status and uptime of the API server
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API is operational
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheck'
 *             example:
 *               status: ok
 *               uptime: 123.45
 *               timestamp: "2025-12-02T10:30:00.000Z"
 *               environment: development
 *       503:
 *         description: Service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error500'
 */
router.get('/health', (req: Request, res: Response): void => {
  const response: HealthResponse = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  };

  res.status(200).json(response);
});

export default router;
