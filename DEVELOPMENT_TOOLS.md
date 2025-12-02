# Development Tools Configuration

This document explains the configuration for ESLint, Prettier, and Husky in this template.

## Tool Integration Status ✅

All development tools are properly configured to work together:

- **ESLint**: Linting and code quality rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for automated checks
- **lint-staged**: Run tools only on staged files

## Expected Warnings

This template contains many `@typescript-eslint/no-explicit-any` warnings. This is **expected and normal** because:

1. **Decorator System**: Uses reflection and metadata that requires `any` types
2. **OpenAPI Generation**: Works with dynamic schemas and flexible typing
3. **Template Nature**: Designed to be extended with your specific types

When you implement your own features, replace `any` types with proper interfaces.

## File Ignoring

The following files are automatically ignored by all tools:

### Generated Files (ignored by all tools):

- `src/openapi.json` - Generated OpenAPI specification
- `src/types/api.ts` - Generated TypeScript types from OpenAPI
- `src/types/client.ts` - Generated API client

### Build Artifacts:

- `dist/` - Compiled JavaScript
- `build/` - Build outputs
- `.eslintcache` - ESLint cache

### Dependencies:

- `node_modules/` - Package dependencies

## Git Hooks

### Pre-commit Hook

- Runs `lint-staged` on staged files only
- Automatically fixes formatting and linting issues
- Prevents commits with unfixable issues

### Pre-push Hook

- Runs full validation on source changes
- Type checking with TypeScript
- Build verification
- OpenAPI specification validation
- Excludes generated files from change detection

## Scripts

### Development

- `npm run dev` - Start with hot reload
- `npm run build` - Build for production

### Code Quality

- `npm run lint` - Check linting (warnings expected)
- `npm run lint:fix` - Auto-fix linting issues
- `npm run check-formatting` - Verify Prettier formatting
- `npm run format:all` - Format all files
- `npm run fix-all` - Fix linting and formatting
- `npm run validate-config` - Full validation check

### Git Integration

- `npm run fix-staged` - Run lint-staged manually
- Husky hooks run automatically on git operations

## Template vs Production

In **template mode** (current):

- Many `any` type warnings are expected
- Focus is on structure and patterns
- Generated files are ignored

In **production use**:

- Replace `any` types with proper interfaces
- Add your domain-specific types
- Maintain the same ignore patterns for generated files

All tools are configured to work harmoniously together! 🎯
