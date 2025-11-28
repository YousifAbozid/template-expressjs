---
agent: agent
---

Role: You are a coding assistant helping to transform this Express.js template into a production-ready project starter.

Context: This is a feature-rich Express.js + MongoDB + JWT authentication template that needs to be cleaned up and personalized for a new project. The template currently contains placeholder content, template-specific information, and example implementations that should be replaced with actual project details.

Task: Clean up the template and make it ready for development by:

## 1. Project Information Collection

First, ask the user for:

- **Project name** (for package.json, README, database name, and other references)
- **Project description** (brief description of what the API will do)
- **Author information** (name, email, GitHub username)
- **Repository URL** (if different from template)
- **Database name** (for MongoDB connection)

## 2. Template Cleanup Tasks

### API Documentation Updates:

- Update Swagger documentation title and description in `src/config/swagger.js`
- Replace template-specific API descriptions with project-specific ones
- Update contact information and API version details
- Keep the existing Swagger structure and example endpoints as starter documentation

### Package.json Updates:

- Update `name`, `description`, `author` fields with project-specific information
- Update `homepage`, `repository`, and `bugs` URLs to match the new project
- Keep all existing dependencies and scripts (they're needed for the architecture)
- Update any template-specific keywords or metadata

### Documentation Updates:

- Update `README.md` with project-specific information
- Replace template description with actual project description and purpose
- Update installation instructions to be project-specific
- Replace template-specific badges and links with project ones
- Update the "Getting Started" section with project context
- Keep the technical documentation about features and architecture

### Configuration Updates:

- Update comments in configuration files (`src/config/`) to reflect project purpose
- Update default database name examples in README and configuration
- Ensure all environment variable examples are project-relevant
- Keep all existing security and performance configurations

### Example Content Cleanup:

- Replace the example `User` model and controller with project-appropriate starter models
- Update route examples in `src/routes/user.routes.js` to match project domain
- Replace generic CRUD operations with project-specific endpoint examples
- Keep the authentication and middleware structure intact
- Update test examples to reflect new model/controller structure

### Environment Configuration:

- Update `.env.example` file comments and variable names to be project-specific
- Provide project-relevant default values for development
- Keep all necessary environment variables for the architecture

## 3. Preservation Requirements

**CRITICAL: DO NOT MODIFY:**

- The existing folder structure in `src/`
- Authentication and JWT implementation in `src/config/passport.js`
- Security middleware configuration (helmet, CORS, rate limiting, etc.)
- Error handling middleware and patterns
- Logging configuration (Winston + Morgan)
- Testing setup and configuration files (Jest, ESLint, Prettier)
- Database connection and configuration structure
- Express app setup and middleware pipeline
- Performance optimizations (compression, etc.)
- Git hooks and development tooling setup

## 4. Clean Starter Content

Replace placeholder content with minimal, professional starter content:

- Create a simple starter model that demonstrates the project domain
- Update controller methods to show basic CRUD operations for the new domain
- Ensure the API still demonstrates authentication, validation, and error handling
- Keep examples of how to use the established patterns (middleware, validation, etc.)
- Maintain the health check endpoint and basic API structure

## 5. Final Deliverables

After cleanup:

- A clean, professional API with project-specific endpoints
- Updated documentation reflecting the new project purpose and setup
- All template references removed from code, comments, and documentation
- A ready-to-develop codebase with all architecture benefits intact
- Example model/controller demonstrating the project domain
- Updated Swagger documentation showcasing the project's API
- Brief explanation of what was changed and what developers should know to start building

## Important Guidelines:

- **Follow REST conventions** in the new endpoint examples
- **Maintain the existing authentication flow** and security patterns
- **Keep the modular structure** of routes, controllers, and models
- **Preserve all middleware** and their configurations
- **Update only content and naming**, not architecture or tooling
- **Ensure all tests still pass** after the cleanup
- **Maintain the development workflow** (hot reload, linting, formatting)

The goal is to transform this from a "template-expressjs" into a project-specific API while maintaining all the production-ready features and development experience optimizations that make this template valuable.
