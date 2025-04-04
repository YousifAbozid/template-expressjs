import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,

  // Database config - add your database connection settings when needed
  db: {
    url:
      process.env.MONGODB_URI || 'mongodb://localhost:27017/express-template',
  },

  // JWT config - add when implementing authentication
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
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

export default config;
