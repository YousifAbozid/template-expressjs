# Express.js Production-Ready Template

A fully-featured, production-ready Express.js template with modern development tooling and best practices built-in.

## Features

- **Modern JavaScript** - ES Modules support
- **Authentication** - JWT-based authentication using Passport.js
- **Database Integration** - MongoDB with Mongoose ODM
- **API Documentation** - Built-in Swagger/OpenAPI documentation
- **Validation** - Request validation with Express Validator
- **Security**
  - CORS configuration
  - Helmet.js for security headers
  - Rate limiting protection
  - Express session support
- **Performance**
  - Compression middleware
- **Logging**
  - Request logging with Morgan
  - Application logging with Winston
- **Developer Experience**
  - Hot reloading with Nodemon
  - ESLint and Prettier integration
  - Git hooks with Husky and lint-staged
- **Testing**
  - Jest testing framework integration
  - Supertest for API testing
  - Code coverage reports

## Project Structure

```
template-expressjs/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # Route definitions
│   ├── app.js          # Express app setup
│   └── index.js        # Application entry point
├── logs/               # Application logs (in production)
├── coverage/           # Test coverage reports
└── tests/              # Test files
```

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- MongoDB

### Installation

1. Clone the repository:

```bash
git clone https://github.com/YousifAbozid/template-expressjs.git
cd template-expressjs
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables (adjust as needed):

```
# Environment
NODE_ENV=development

# Server
PORT=3000
HOST=localhost

# MongoDB
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Session
SESSION_SECRET=your-session-secret
```

4. Start the development server:

```bash
npm run dev
```

The server will be running at `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start the development server with hot reloading
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting with Prettier
- `npm run fix-all` - Fix all linting and formatting issues
- `npm run upgrade` - Upgrade all dependencies to their latest versions
- `npm run prepare` - Set up Husky git hooks
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage reports

## API Documentation

Once the server is running, you can access the Swagger UI documentation at:

```
http://localhost:3001/api/docs
```

This provides interactive documentation for all available API endpoints.

## Authentication

The template uses JWT (JSON Web Tokens) for authentication, implemented with Passport.js.

### User Routes

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get a JWT token
- `GET /api/users/profile` - Get authenticated user profile (protected route)
- `PUT /api/users` - Update user information (protected route)
- `DELETE /api/users` - Delete user account (protected route)

### Authentication Flow

1. Register a user or login with credentials
2. Receive a JWT token
3. Include the token in subsequent requests in the Authorization header:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

## Middleware

The template includes several middleware components:

- **Error Handling** - Centralized error handling
- **Validation** - Request validation using express-validator
- **Rate Limiting** - Protection against brute force attacks
- **Authentication** - JWT-based authentication checks

## Testing

The template uses Jest for testing. Tests are located in the `tests` directory.

To run tests:

```bash
npm test
```

To generate coverage reports:

```bash
npm run test:coverage
```

Coverage reports are generated in the `coverage` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [Passport.js](http://www.passportjs.org/)
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express)
