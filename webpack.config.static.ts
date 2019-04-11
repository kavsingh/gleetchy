import webpack, { Configuration } from 'webpack'

import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'
import baseConfig, { publicPath } from './webpack.config'

const config: Configuration = {
  module: baseConfig.module,
  resolve: baseConfig.resolve,
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
  plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })],
}

export default config
