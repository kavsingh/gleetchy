const env = process.env.NODE_ENV

module.exports = {
  presets: [
    '@babel/preset-typescript',
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
              modules: 'commonjs',
              useBuiltIns: false,
            }
          : {},
      ),
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'webpack-alias',
    env === 'production' && [
      'transform-react-remove-prop-types',
      {
        removeImport: true,
        additionalLibraries: ['react-style-proptype', '~/PropTypes'],
      },
    ],
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
