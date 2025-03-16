import eslintPluginPrettier from 'eslint-plugin-prettier';

export default [
    {
        ignores: ['node_modules', 'dist'], // Игнорируем ненужные папки
    },
    {
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'], // Файлы для проверки
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
        },
        plugins: {
            prettier: eslintPluginPrettier,
        },
        rules: {
            'prettier/prettier': 'error',
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'no-unused-vars': 'warn',
            'no-console': 'off',
        },
    },
];
