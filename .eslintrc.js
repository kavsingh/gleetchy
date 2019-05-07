const unusedVarsConfig = [
  'warn',
  { ignoreRestSiblings: true, varsIgnorePattern: '^_' },
]

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: './',
    jsx: true,
  },
  settings: {
    react: { version: 'detect' },
  },
  env: { node: true, browser: false, es6: true },
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jest', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'no-console': 'off',
    '@typescript-eslint/interface-name-prefix': ['warn', 'never'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'no-unused-vars': unusedVarsConfig,
        '@typescript-eslint/no-unused-vars': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': unusedVarsConfig,
      },
    },
    {
      files: ['*.test.*'],
      env: { node: true, 'jest/globals': true },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
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
