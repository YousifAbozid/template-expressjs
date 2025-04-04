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
import './config/passport.js';
import config from './config/index.js';
import swaggerSpec from './config/swagger.js';
import { morganStream } from './config/logger.js';

// Initialize express app
const app = express();

// Apply middleware
app.use(helmet()); // Adds security headers
app.use(compression()); // Compresses responses
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Skip logging during tests
if (config.env !== 'test') {
  app.use(
    morgan(config.env === 'development' ? 'dev' : 'combined', {
      stream: morganStream,
    })
  );
}

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

export default app;
