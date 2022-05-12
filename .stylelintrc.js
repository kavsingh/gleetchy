module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-prettier',
    'stylelint-config-rational-order-fix',
  ],
  plugins: ['stylelint-use-logical-spec'],
  rules: {
    'liberty/use-logical-spec': 'always',
  },
  overrides: [
    {
      files: ['**/*.tsx'],
      customSyntax: 'postcss-jsx',
    },
  ],
}
