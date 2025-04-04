import dotenv from 'dotenv';
import connectDB from './config/db.js';
import logger from './config/logger.js';
import app from './app.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  logger.info(`Server running on port ${PORT}`)
);

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

export default server;
