module.exports = {
  parser: 'babel-eslint',

  settings: {
    'import/resolver': 'webpack',
  },

  env: { browser: true },

  plugins: ['inferno', 'prettier'],

  extends: [
    'mongrel',
    'prettier',
    'prettier/react',
    'plugin:inferno/recommended',
  ],

  rules: {
    'prettier/prettier': [
      'warn',
      {
        semi: false,
        singleQuote: true,
        trailingComma: 'all',
        bracketSpacing: true,
      },
    ],
  },
}
