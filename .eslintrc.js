module.exports = {
  parser: 'babel-eslint',

  settings: {
    'import/resolver': 'webpack',
  },

  env: { browser: true },

  plugins: ['prettier'],

  extends: [
    'mongrel-react',
    'prettier',
    'prettier/react',
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
