module.exports = {
  env: { node: true, browser: false },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    'no-console': 'off'
    'prettier/prettier': 'warn',
  },
  globals: {
    process: false,
  },
}
