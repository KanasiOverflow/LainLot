import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  js.configs.recommended, // Базовые правила JavaScript
  prettierConfig, // Отключаем конфликтующие правила ESLint с Prettier
  {
    ignores: ['node_modules', 'dist'], // Игнорируем ненужные папки
  },
  {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'], // Файлы для проверки
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 'latest',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        process: 'readonly',
        FileReader: 'readonly',
        URL: 'readonly',
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        btoa: 'readonly',
        IntersectionObserver: 'readonly',
      },
    },
    plugins: {
      prettier: prettierPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      'prettier/prettier': 'error', // Используем Prettier
      quotes: ['error', 'single'], // Одинарные кавычки
      semi: ['error', 'always'], // Всегда ставить `;`
      'no-unused-vars': 'warn', // Предупреждение для неиспользуемых переменных
      'no-console': 'off', // Разрешаем `console.log`
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error', // Проверяет правила хуков
      'react-hooks/exhaustive-deps': 'warn', // Проверяет зависимости эффектов
    },
  },
];
