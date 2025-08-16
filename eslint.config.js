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
        ...globals.browser,
        ...globals.node,
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
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      // Disable no-redeclare for TypeScript function overloads
      'no-redeclare': 'off',
      '@typescript-eslint/no-redeclare': 'off'
    }
  },
  {
    ignores: [
      'build/',
      'dist/',
      'node_modules/',
      '.docusaurus/',
      'docusaurus.config.ts',
      'sidebars.ts',
      '**/*.d.ts'
    ]
  }
];
