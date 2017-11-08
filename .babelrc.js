const env = process.env.NODE_ENV

const presetEnv = [
  'env',
  {
    modules: env === 'test' ? 'commonjs' : false,
    useBuiltIns: env === 'test' ? false : 'usage',
    loose: true,
  },
]

module.exports = {
  presets: [presetEnv, 'react'],
  plugins: [
    'styled-jsx/babel',
    'transform-object-rest-spread',
    'webpack-alias',
    // env !== 'test' && ['lodash', { id: ['ramda'] }],
  ].filter(Boolean),
}
