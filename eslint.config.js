import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node, // Node.js globals
      },
      sourceType: 'module',
    },
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'no-unused-vars': [
        'error', // Changed from 'warn' to 'error' to make Husky fail
        {
          argsIgnorePattern: '^_', // ✅ Ignore function arguments prefixed with `_`
          varsIgnorePattern: '^_', // ✅ Ignore unused variables prefixed with `_`
          caughtErrorsIgnorePattern: '^_', // ✅ Ignore unused error params prefixed with `_`
        },
      ],
      'no-undef': 'off',
      'no-console': 'off',
      'no-unused-expressions': 'off',
    },
  },
]);
