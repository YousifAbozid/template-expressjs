# Development Workflow Guide

This guide explains which npm scripts to use for common development tasks in this Express.js TypeScript template.

## 🚀 Quick Start Commands

### Development

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server (requires build first)

### Code Quality

- `npm run fix` - Fix all linting and formatting issues
- `npm run test` - Run all validation checks (formatting, linting, types)

### Building

- `npm run build` - Build production bundle and generate API artifacts

## 📋 Complete Script Reference

### Core Development

| Script          | Purpose                            | When to Use              |
| --------------- | ---------------------------------- | ------------------------ |
| `npm run dev`   | Development server with hot reload | Daily development        |
| `npm start`     | Production server                  | Testing production build |
| `npm run build` | Production build + API generation  | Before deployment        |
| `npm run clean` | Remove build artifacts             | Clean slate builds       |

### Code Quality & Validation

| Script                 | Purpose                                 | When to Use               |
| ---------------------- | --------------------------------------- | ------------------------- |
| `npm run test`         | Full validation (format + lint + types) | Before pushing code       |
| `npm run fix`          | Auto-fix linting and formatting         | When you have code issues |
| `npm run lint`         | Check code quality only                 | Quick linting check       |
| `npm run lint:fix`     | Fix linting issues only                 | Linting-specific fixes    |
| `npm run format`       | Format all code                         | Format-specific fixes     |
| `npm run format:check` | Check formatting only                   | Quick format validation   |
| `npm run type-check`   | TypeScript type checking                | Type-specific validation  |

### API Development Workflow

| Script                 | Purpose                        | When to Use                           |
| ---------------------- | ------------------------------ | ------------------------------------- |
| `npm run api:generate` | Generate all API artifacts     | After adding/modifying routes or DTOs |
| `npm run api:spec`     | Generate OpenAPI specification | When you only need the spec           |
| `npm run api:types`    | Generate TypeScript types      | For frontend type definitions         |
| `npm run api:client`   | Generate API client            | For frontend API client               |
| `npm run api:validate` | Validate API specification     | Check API spec validity               |
| `npm run api:docs`     | Serve API documentation        | View Swagger UI docs                  |

### Utilities

| Script            | Purpose             | When to Use              |
| ----------------- | ------------------- | ------------------------ |
| `npm run upgrade` | Update dependencies | Monthly maintenance      |
| `npm run prepare` | Setup git hooks     | Automatic on npm install |

## 🔄 Development Workflows

### Adding a New API Endpoint

1. **Create your route handler** in `src/routes/`
2. **Add DTOs with decorators** in your route file or separate DTO files
3. **Run API generation**: `npm run api:generate`
4. **Test your changes**: `npm run dev`
5. **View API docs**: `npm run api:docs`

**Example workflow:**

```bash
# After creating new routes/DTOs
npm run api:generate    # Generates spec, types, and client
npm run dev            # Test in development
npm run api:docs       # View documentation
npm run test           # Validate before commit
```

### Before Committing Code

Git hooks automatically run checks, but you can run manually:

```bash
npm run fix     # Fix any issues
npm run test    # Full validation
git add .
git commit -m "your message"  # Pre-commit hook runs automatically
```

### Before Pushing to Remote

```bash
git push  # Pre-push hook automatically runs npm run test
```

### Frontend Integration

After adding/modifying API endpoints:

1. **Generate types for frontend**: `npm run api:types`
2. **Copy generated types**: `src/types/api.ts` contains all TypeScript interfaces
3. **Use API client**: `src/types/client.ts` contains API client functions
4. **API specification**: `src/openapi.json` for other tooling

## 🎯 Key Points

- **Always run `npm run api:generate`** after creating or modifying routes/DTOs
- **Generated files are automatically ignored** by git and formatters
- **Use `npm run fix`** instead of running linting/formatting separately
- **Git hooks prevent bad code** from being committed or pushed
- **The `test` script runs all validation checks** - use it before pushing

## 🔧 Generated Files

These files are automatically generated and should not be edited manually:

- `src/openapi.json` - OpenAPI specification
- `src/types/api.ts` - TypeScript type definitions
- `src/types/client.ts` - API client functions
