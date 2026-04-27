/**
 * ESLint Configuration - BiteDash Code Quality Rules
 * 
 * Enforces code quality standards with strict error checking.
 * Compatible with ESLint 9.x flat config format.
 * Critical issues = error (blocks PR), Minor issues = warn
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '*.config.js'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        global: 'readonly',
        process: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      
      // ============ ERRORS - Will FAIL the build ============
      'no-undef': 'error',
      'no-const-assign': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-func-assign': 'error',
      'no-import-assign': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'valid-typeof': 'error',
      'react-hooks/rules-of-hooks': 'error',
      
      // ============ WARNINGS - Won't fail build ============
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]|^_',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      }],
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'no-empty': 'warn',
      'no-async-promise-executor': 'warn',
    },
  },
]
