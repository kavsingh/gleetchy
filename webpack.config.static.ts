import webpack, { Configuration } from 'webpack'

import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'

const publicPath = ''

const config: Configuration = {
  mode: 'production',
  entry: {
    gleetchy: ['./src/indexStatic.tsx'],
  },
  target: 'node',
  output: {
    publicPath,
    library: 'gleetchy',
    libraryTarget: 'commonjs2',
    filename: 'gleetchy.js',
    path: fromRoot('distStatic'),
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: fromRoot('node_modules'),
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.(wav|mp3|ogg|png)$/,
        use: [{ loader: 'file-loader' }],
      },
    ],
  },
  plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'development' })],
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}

export default config
