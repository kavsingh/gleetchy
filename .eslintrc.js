module.exports = {
  parser: 'babel-eslint',

  settings: {
    'import/resolver': 'webpack',
  },

  env: { browser: true },

  extends: ['mongrel', 'plugin:inferno/recommended'],

  plugins: ['inferno'],
}
