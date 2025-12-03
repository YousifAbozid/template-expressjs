import { Router } from 'express';
import { healthRoutes } from '@/controllers/index.js';

const router = Router();

// Health check endpoint
router.get('/health', ...healthRoutes.healthCheck);

// Example routes will be added here following the established patterns
// See IMPLEMENTATION_GUIDE.md for adding new routes

export default router;
