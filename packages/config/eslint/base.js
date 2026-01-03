import 'eslint-plugin-only-warn';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import turboPlugin from 'eslint-plugin-turbo';
import tseslint from 'typescript-eslint';

const config = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      'no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'turbo/no-undeclared-env-vars': 'warn',
    },
  },
  eslintConfigPrettier,
  {
    ignores: ['dist/**', '.next/**', '.turbo/**', 'coverage/**'],
  },
];

export { config };
export default config;
