import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import hpp from 'hpp';
import type { Application } from 'express';

import { notFound, errorHandler } from '@/middleware/error.js';
import { globalLimiter } from '@/middleware/rateLimiter.js';
import routes from '@/routes/index.js';
import config from '@/config/index.js';
import { HealthController } from './controllers/index.js';
import { generateOpenApiSpec } from './swagger/index.js';

// Initialize express app
const app: Application = express();

// Generate OpenAPI spec directly
const controllers = [HealthController];
const swaggerSpec = generateOpenApiSpec(controllers);

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet()); // Security headers
app.use(hpp()); // HTTP Parameter Pollution protection

// Performance middleware
app.use(compression()); // Compress responses

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  })
);

// Rate limiting
app.use(globalLimiter);

// Session configuration
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.env === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// API documentation
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
    },
  })
);

// API documentation JSON endpoint
app.get('/api/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(swaggerSpec);
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Express TypeScript API Template',
    documentation: '/api/docs',
    health: '/api/health',
    version: '1.0.0',
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

export default app;
