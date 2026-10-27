import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.flat.recommended,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['eslint.config.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    // 01 mục 3, 9: luật game thuần, không React, không DOM, RNG có seed.
    files: ['src/luat/**/*.ts'],
    rules: {
      'no-restricted-properties': [
        'error',
        { object: 'Math', property: 'random', message: 'Dùng Rng truyền vào (01 mục 6).' },
      ],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react', 'react-dom', 'react/*', 'react-dom/*'], message: 'luat/ không import React.' },
            { group: ['**/giao_dien/**', '**/giao_dien'], message: 'luat/ không import giao diện.' },
          ],
        },
      ],
      'no-restricted-globals': [
        'error',
        { name: 'window', message: 'luat/ không dùng DOM.' },
        { name: 'document', message: 'luat/ không dùng DOM.' },
        { name: 'localStorage', message: 'luat/ không dùng DOM.' },
      ],
    },
  },
)
