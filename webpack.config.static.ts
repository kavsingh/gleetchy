import webpack, { Configuration } from 'webpack'

import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'
import baseConfig, { publicPath } from './webpack.config'

const config = (): Configuration => {
  const { module, resolve } = baseConfig({ env: 'production' })

  return {
    module,
    resolve,
    mode: 'production',
    entry: {
      gleetchy: ['./src/index-static.tsx'],
    },
    target: 'node',
    output: {
      publicPath,
      library: 'gleetchy',
      libraryTarget: 'commonjs2',
      filename: 'gleetchy.js',
      path: fromRoot('dist-static'),
    },
    plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })],
  }
}

export default config
