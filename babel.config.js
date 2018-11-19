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
        env === 'test' ? { modules: 'commonjs', useBuiltIns: false } : {},
      ),
    ],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'webpack-alias',
    [
      'transform-imports',
      {
        ramda: {
          preventFullImport: true,
          transform: name => `ramda/es/${name}`,
        },
      },
    ],
  ],
}
