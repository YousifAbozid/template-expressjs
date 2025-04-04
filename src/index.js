import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';

import { notFound, errorHandler } from './middleware/error.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';
import connectDB from './config/db.js';
import './config/passport.js';
import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import logger, { morganStream } from './config/logger.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet()); // Adds security headers
app.use(compression()); // Compresses responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(
  morgan(config.env === 'development' ? 'dev' : 'combined', {
    stream: morganStream,
  })
);
app.use(globalLimiter); // Apply rate limiting to all requests

// Session configuration
app.use(
  session({
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.env === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Swagger documentation
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
  })
);

// Apply routes
app.use('/api', routes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Express.js API Template',
    documentation: '/api/docs',
    health: '/api/health',
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  logger.error('Unhandled Rejection:', err);
  // For clean shutdown in production, consider process.exit(1)
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  logger.error('Uncaught Exception:', err);
  // In production, you might want to gracefully shutdown after logging
  // process.exit(1)
});
