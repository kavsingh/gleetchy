const env = process.env.NODE_ENV

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      Object.assign(
        {
          modules: false,
          useBuiltIns: 'usage',
          shippedProposals: true,
          loose: true,
        },
        env === 'test'
          ? {
              sourceType: 'module',
              modules: 'commonjs',
              useBuiltIns: false,
            }
          : {},
      ),
    ],
    '@babel/preset-react',
  ],
  plugins: [
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
