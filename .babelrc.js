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
    // ['lodash', { id: ['ramda'] }],
    'styled-jsx/babel',
    'transform-object-rest-spread',
    'webpack-alias',
    env === 'test' && 'transform-es2015-modules-commonjs',
  ].filter(Boolean),
}
