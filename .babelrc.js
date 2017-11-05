module.exports = {
  presets: [
    [
      'env',
      {
        modules: false,
        useBuiltIns: 'usage',
        loose: true,
      },
    ],
    'react',
  ],
  plugins: [
    // ['lodash', { id: ['ramda'] }],
    'styled-jsx/babel',
    'transform-object-rest-spread',
    'webpack-alias',
  ],
  env: {
    test: {
      plugins: ['transform-es2015-modules-commonjs'],
    },
  },
}
