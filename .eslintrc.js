module.exports = {
  parser: 'babel-eslint',
  env: { node: true, browser: false, es6: true },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:import/errors', 'prettier'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-console': 'off',
    'prettier/prettier': 'warn',
  },
  globals: {
    process: false,
  },
}
