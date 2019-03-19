import path from 'path'
import webpack, { Configuration } from 'webpack'

import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'

const publicPath = ''

const config: Configuration = {
  mode: 'production',
  entry: {
    gleetchy: ['./src/indexStatic.tsx'],
  },
  output: {
    publicPath,
    library: 'gleetchy',
    libraryTarget: 'commonjs',
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
  plugins: [new webpack.EnvironmentPlugin(['NODE_ENV'])],
  resolve: {
    modules: [fromRoot('src'), 'node_modules'],
    alias: { '~': path.resolve(__dirname, 'src') },
    extensions: ['.js', '.ts', '.tsx'],
  },
}

export default config
