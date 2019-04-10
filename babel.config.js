module.exports = ({ env }) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        corejs: 3,
        modules: env('test') ? 'commonjs' : false,
        useBuiltIns: env('test') ? false : 'usage',
        shippedProposals: true,
        loose: true,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'babel-plugin-emotion',
    'webpack-alias',
    !env('test') && [
      'transform-imports',
      {
        ramda: {
          preventFullImport: true,
          transform: name => `ramda/es/${name}`,
        },
      },
    ],
  ].filter(Boolean),
})
