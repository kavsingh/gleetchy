module.exports = {
  parser: 'babel-eslint',
  settings: { 'import/resolver': 'webpack' },
  env: { node: true, browser: false },
  plugins: ['prettier'],
  extends: ['mongrel-react', 'prettier', 'prettier/react'],
  rules: {
    'prettier/prettier': 'warn',
  },
  overrides: [
    {
      files: 'src/**/*.js',
      env: { node: false, browser: true },
    },
    {
      files: 'src/**/*.test.js',
      env: { jest: true },
      rules: { 'max-nested-callbacks': 'off' },
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
