/**
 * ESLint Configuration - BiteDash Code Quality Rules
 * 
 * Enforces code quality standards with strict error checking
 * Critical issues = error (blocks PR), Minor issues = warn
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
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
    rules: {
      // ============ ERRORS - Will FAIL the build ============
      'no-undef': 'error',                    // Undefined variables
      'no-const-assign': 'error',             // Reassigning const
      'no-dupe-keys': 'error',                // Duplicate keys in objects
      'no-duplicate-case': 'error',           // Duplicate case in switch
      'no-func-assign': 'error',              // Reassigning functions
      'no-import-assign': 'error',            // Reassigning imports
      'no-unreachable': 'error',              // Unreachable code
      'no-unsafe-negation': 'error',          // Unsafe negation
      'valid-typeof': 'error',                // Invalid typeof comparisons
      'react-hooks/rules-of-hooks': 'error',  // React hooks rules
      
      // ============ WARNINGS - Won't fail build ============
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^[A-Z_]|^_',
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      }],
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': 'warn',
      'no-empty': 'warn',
      'no-async-promise-executor': 'warn',
    },
  },
])
