const env = process.env.NODE_ENV

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: env === 'test' ? 'commonjs' : false,
        useBuiltIns: env === 'test' ? false : 'usage',
        shippedProposals: true,
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
    env !== 'test' && [
      'transform-imports',
      {
        ramda: {
          preventFullImport: true,
          transform: name => `ramda/es/${name}`,
        },
      },
    ],
  ].filter(Boolean),
}
