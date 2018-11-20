const path = require('path')
const webpack = require('webpack')

const fromRoot = path.resolve.bind(path, __dirname)
const publicPath = ''

module.exports = {
  mode: 'production',
  entry: {
    gleetchy: ['@babel/polyfill', './src/indexStatic.tsx'],
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
