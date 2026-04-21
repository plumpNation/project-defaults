import js from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

const importSortGroups = [
  ['^\\u0000'],
  ['^(?!.*\\.(?:css|scss|sass|less)$)[^./]'],
  ['^\\.(?!.*\\.(?:css|scss|sass|less)$)'],
  ['^[^./].*\\.(?:css|scss|sass|less)$'],
  ['^\\.{1,2}/.*\\.(?:css|scss|sass|less)$'],
];

export default tseslint.config(
  {
    ignores: ['**/dist/**', '**/build/**', '**/coverage/**', '**/node_modules/**'],
  },

  js.configs.recommended,

  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,mts,cts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'simple-import-sort/imports': ['error', { groups: importSortGroups }],
      'simple-import-sort/exports': 'error',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'jsx-quotes': ['error', 'prefer-double'],
      'max-len': ['error', {
        code: 120,
        tabWidth: 2,
        ignoreComments: false,
        ignoreStrings: false,
        ignoreTemplateLiterals: false,
        ignoreRegExpLiterals: false,
        ignoreTrailingComments: false,
        ignoreUrls: false,
      }],
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'no-trailing-spaces': 'error',
      'object-curly-newline': ['error', {
        ObjectExpression: { multiline: true, consistent: true, minProperties: 2 },
        ObjectPattern: { multiline: true, consistent: true, minProperties: 2 },
        ImportDeclaration: { multiline: true, consistent: true, minProperties: 2 },
        ExportDeclaration: { multiline: true, consistent: true, minProperties: 2 },
      }],
      'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
      'array-element-newline': ['error', { multiline: true, minItems: 2 }],
      'array-bracket-newline': ['error', 'consistent'],
      'function-paren-newline': ['error', 'multiline-arguments'],
      'multiline-ternary': ['error', 'always-multiline'],
      'operator-linebreak': ['error', 'before'],
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false, allowUnboundThis: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ExportNamedDeclaration > FunctionDeclaration',
          message: 'Export a const arrow function instead of a function declaration.',
        },
        {
          selector: 'ExportDefaultDeclaration > FunctionDeclaration',
          message: 'Export a const arrow function instead of a function declaration.',
        },
        {
          selector: 'ExportNamedDeclaration > VariableDeclaration > VariableDeclarator[init.type="FunctionExpression"]',
          message: 'Export a const arrow function instead of a function expression.',
        },
        {
          selector: 'PropertyDefinition[value.type="ArrowFunctionExpression"]',
          message: 'Use a class method instead of a class arrow function.',
        },
        {
          selector: 'ClassProperty[value.type="ArrowFunctionExpression"]',
          message: 'Use a class method instead of a class arrow function.',
        },
      ],
    },
  },

  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    extends: [tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir,
      },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
        disallowTypeAnnotations: true,
      }],
    },
  },

  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    files: ['**/*.{jsx,tsx,mjsx,mtsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);