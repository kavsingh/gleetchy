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
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    '@emotion/babel-plugin',
    '@babel/plugin-proposal-class-properties',
    ['@babel/plugin-transform-runtime', { regenerator: true }],
    [
      'babel-plugin-module-resolver',
      { alias: { '~': './src' }, extensions: ['.ts', '.tsx', '.js', '.jsx'] },
    ],
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
