import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import cypress from 'eslint-plugin-cypress/flat';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['lib/**', 'example-dist/**', 'node_modules/**', '.yarn/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Using the new JSX transform, the React import is not required.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-curly-newline': 'off',
      // forwardRef render functions are intentionally anonymous here.
      'react/display-name': 'off',
      'react-hooks/exhaustive-deps': 'error',
      // The codebase relies on `any`/`{}` in a few generic helpers; keep the
      // pre-existing lenience rather than rewriting types in a tooling migration.
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
    },
  },
  {
    files: ['cypress/**/*.{js,ts}', 'cypress.config.ts'],
    ...cypress.configs.recommended,
    languageOptions: {
      ...cypress.configs.recommended.languageOptions,
      globals: {
        ...cypress.configs.recommended.languageOptions?.globals,
        ...globals.node,
      },
    },
    rules: {
      ...cypress.configs.recommended.rules,
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
