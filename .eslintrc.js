const srcDependencies = {
  devDependencies: false,
  optionalDependencies: false,
  peerDependencies: false,
}

const devDependencies = {
  devDependencies: true,
  optionalDependencies: false,
  peerDependencies: false,
}

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: { es6: true, node: true, browser: false },
  settings: {
    'react': { version: 'detect' },
    'import/resolver': 'babel-module',
  },
  plugins: [
    '@typescript-eslint',
    'filenames',
    'import',
    'react',
    'react-hooks',
    '@emotion',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  rules: {
    'camelcase': 'off',
    'curly': ['warn', 'multi-line', 'consistent'],
    'no-console': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'filenames/match-regex': ['error', '^[a-z0-9-.]+$', true],
    'filenames/match-exported': ['error', 'kebab'],
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/no-unused-modules': 'error',
    'import/no-useless-path-segments': 'error',
    'import/no-extraneous-dependencies': ['error', devDependencies],
    'import/order': [
      'warn',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'pathGroups': [{ pattern: '~/**', group: 'internal' }],
        'newlines-between': 'always',
      },
    ],
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@emotion/syntax-preference': ['error', 'string'],
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: ['*.config.*'],
      rules: {
        'filenames/match-exported': 'off',
      },
    },
    {
      files: ['src/**/*'],
      env: { node: false, browser: true },
      rules: {
        'no-console': 'error',
        '@typescript-eslint/no-var-requires': 'error',
        'import/no-extraneous-dependencies': ['error', srcDependencies],
      },
    },
    {
      files: ['**/*.test.*'],
      env: { 'node': true, 'jest/globals': true },
      plugins: ['jest'],
      extends: ['plugin:jest/recommended', 'plugin:jest/style'],
      rules: {
        'no-console': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'import/no-extraneous-dependencies': ['error', devDependencies],
      },
    },
  ],
}
