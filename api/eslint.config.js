import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  js.configs.recommended,
  // Configuration for all TypeScript files
  {
    files: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        sourceType: 'module'
      },
      globals: {
        ...globals.node,
        // Add browser globals for APIs that might be used in Node.js
        RequestInit: 'readonly',
        Response: 'readonly',
        fetch: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      // Disable some strict rules for better compatibility
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      // Disable no-redeclare for TypeScript function overloads
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      // Node.js specific rules
      'no-console': 'off', // Allow console.log in API code
      '@typescript-eslint/no-require-imports': 'off' // Allow require() when needed
    }
  },
  // Vitest-specific globals for test files
  {
    files: [
      'src/**/*.{test,spec}.ts',
      'src/**/*.{test,spec}.tsx',
      'scripts/**/*.{test,spec}.ts'
    ],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  },
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', '**/*.d.ts']
  }
];
