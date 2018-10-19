const importDev = {
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: true,
      optionalDependencies: false,
      peerDependencies: false,
    },
  ],
}

const importSrc = {
  'import/no-extraneous-dependencies': [
    'error',
    {
      devDependencies: false,
      optionalDependencies: false,
      peerDependencies: false,
    },
  ],
}

module.exports = {
  parser: 'babel-eslint',
  settings: { 'import/resolver': 'webpack' },
  env: { node: true, browser: false },
  plugins: ['prettier'],
  extends: ['mongrel-react', 'prettier', 'prettier/react'],
  rules: {
    ...importDev,
    'react/destructuring-assignment': 'off',
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: 'src/**/*.js',
      env: { node: false, browser: true },
      rules: { ...importSrc },
    },
    {
      files: 'src/indexStatic.js',
      rules: { ...importDev },
    },
    {
      files: 'src/**/*.test.js',
      env: { jest: true },
      rules: { ...importDev, 'max-nested-callbacks': 'off' },
    },
    {
      files: 'scripts/bin/**/*.js',
      rules: { 'no-console': 'off' },
    },
  ],
  globals: {
    process: false,
  },
}
