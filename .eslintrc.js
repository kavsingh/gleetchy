module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  settings: {
    react: { version: 'detect' },
  },
  env: { node: true, browser: false, es6: true },
  plugins: ['@typescript-eslint', 'jest', 'react', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/interface-name-prefix': ['warn', 'never'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['*.test.*'],
      env: { node: true, 'jest/globals': true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/prefer-to-have-length': 'warn',
        'jest/valid-expect': 'error',
      },
    },
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      env: { node: false, browser: true },
      rules: {
        'no-console': 'error',
        '@typescript-eslint/no-var-requires': 'error',
      },
    },
  ],
  globals: {
    process: false,
  },
}
