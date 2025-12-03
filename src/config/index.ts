import { config } from 'dotenv';
import type { AppConfig } from '@/types/index.js';

// Load environment variables
config();

const appConfig: AppConfig = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),

  // Database config
  db: {
    url:
      process.env.MONGODB_URI || 'mongodb://localhost:27017/express-template',
  },

  // Session config
  session: {
    secret: process.env.SESSION_SECRET || 'session-secret-key',
  },

  // CORS options
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
  },
};

export default appConfig;
