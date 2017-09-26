module.exports = {
  parser: 'babel-eslint',

  settings: {
    'import/resolver': 'webpack',
  },

  env: {
    node: true,
    browser: false,
  },

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

  overrides: [
    {
      files: 'src/**/*.js',
      env: {
        node: false,
        browser: true,
      },
    }
  ]
}
