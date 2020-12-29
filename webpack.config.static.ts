import webpack, { Configuration } from 'webpack'

import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'
import baseConfigFactory, { publicPath } from './webpack.config'

const configFactory = (): Configuration => {
  const { module, resolve } = baseConfigFactory({ production: true })

  return {
    module,
    resolve,
    mode: 'production',
    devtool: false,
    entry: { gleetchy: ['./src/index-static.tsx'] },
    target: 'node',
    output: {
      publicPath,
      libraryTarget: 'commonjs2',
      filename: 'gleetchy.js',
      path: fromRoot('dist-static'),
    },
    plugins: [new webpack.EnvironmentPlugin({ NODE_ENV: 'production' })],
  }
}

export default configFactory
