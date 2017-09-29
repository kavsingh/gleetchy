module.exports = {
  presets: [
    [
      'env',
      {
        modules: false,
        useBuiltIns: 'usage',
        loose: true,
        targets: {
          browsers: '> 1%, Last 2 versions',
        },
      },
    ],
    'react',
  ],
  plugins: [
    ['lodash', { id: ['ramda'] }],
    'styled-jsx/babel',
    'transform-object-rest-spread',
  ],
  env: {
    test: {
      plugins: ['transform-es2015-modules-commonjs'],
    },
  },
}
