module.exports = ({ env }) => ({
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        shippedProposals: true,
        corejs: 3,
        modules: env('test') ? 'commonjs' : false,
      },
    ],
    '@babel/preset-react',
    '@emotion/babel-preset-css-prop',
    '@babel/preset-typescript',
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      'babel-plugin-module-resolver',
      {
        alias: { '~': './src' },
        extensions: ['.ts', '.tsx', '.js'],
      },
    ],
    'babel-plugin-emotion',
    !env('test') && [
      'transform-imports',
      {
        ramda: {
          preventFullImport: true,
          transform: (name) => `ramda/es/${name}`,
        },
      },
    ],
  ].filter(Boolean),
})
