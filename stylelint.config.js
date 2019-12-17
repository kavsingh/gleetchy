// Specific use of order plugins: https://github.com/constverum/stylelint-config-rational-order/issues/10#issuecomment-484426011

module.exports = {
  processors: ['stylelint-processor-styled-components'],
  plugins: ['stylelint-order', 'stylelint-config-rational-order/plugin'],
  extends: [
    'stylelint-config-recommended',
    'stylelint-config-styled-components',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'order/properties-order': [],
    'plugin/rational-order': [true, { 'border-in-box-model': true }],
  },
}
