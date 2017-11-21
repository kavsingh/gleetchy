const env = process.env.NODE_ENV

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: env === 'test' ? 'commonjs' : false,
        useBuiltIns: env === 'test' ? false : 'usage',
        loose: true,
      },
    ],
    '@babel/preset-react',
  ],
  plugins: [
    'styled-jsx/babel',
    '@babel/plugin-syntax-object-rest-spread',
    '@babel/plugin-proposal-object-rest-spread',
    'webpack-alias',
    env !== 'test' && ['lodash', { id: ['ramda'] }],
  ].filter(Boolean),
}
