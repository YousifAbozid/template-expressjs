import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.eslintcache',
      'eslint.config.js',
      '**/*.config.js',
      '.husky/**',
    ],
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // Unused variables handling
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Node.js specific rules
      'no-undef': 'off',
      'no-console': 'off', // Allow console in Node.js
      'no-unused-expressions': 'off',

      // Best practices for Node.js
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'warn',

      // Error handling
      'no-throw-literal': 'error',
      'prefer-promise-reject-errors': 'error',

      // Code style
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-else-return': 'warn',
    },
  },
];
