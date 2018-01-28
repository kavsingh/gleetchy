const path = require('path')
const webpack = require('webpack')

const fromRoot = path.resolve.bind(path, __dirname)
const publicPath = ''

module.exports = {
  entry: {
    gleetchy: [
      '@babel/polyfill',
      'regenerator-runtime',
      './src/indexStatic.js',
    ],
  },
  output: {
    library: 'gleetchy',
    libraryTarget: 'commonjs',
    filename: 'gleetchy.js',
    path: fromRoot('distStatic'),
    publicPath,
  },
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
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
    alias: {
      react: 'preact-compat',
      'react-dom': 'preact-compat',
      '~': path.resolve(__dirname, 'src'),
    },
    extensions: ['.js'],
  },
}
