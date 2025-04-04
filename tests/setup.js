import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env file
dotenv.config({ path: path.join(rootDir, '.env') });

// Set test environment variables, fallback to values from .env
process.env.NODE_ENV = 'test';
process.env.PORT = process.env.TEST_PORT || 5001; // Use TEST_PORT from .env or fallback to 5001

// Use the same DB as in .env but with -test suffix
const dbName = process.env.MONGODB_URI.split('/').pop();
process.env.MONGODB_URI = process.env.MONGODB_URI.replace(
  dbName,
  `${dbName}-test`
);

// Set test secrets or use from .env
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.SESSION_SECRET =
  process.env.SESSION_SECRET || 'test-session-secret';

console.log('Test DB:', process.env.MONGODB_URI);
