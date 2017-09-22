const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const servePublic = process.env.PUBLIC === true
const fromRoot = path.resolve.bind(path, __dirname)
const publicPath = '/'

module.exports = {
  entry: {
    app: ['./src/index.js'],
  },
  output: {
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    path: fromRoot('dist'),
    publicPath,
  },
  devtool: isProduction ? 'source-map' : 'cheap-eval-sourcemap',
  devServer: {
    host: servePublic ? '0.0.0.0' : 'localhost',
    port: 3000,
    inline: true,
    hot: true,
    historyApiFallback: { index: publicPath },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: fromRoot('node_modules'),
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/,
        exclude: fromRoot('node_modules'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: 1,
                importLoaders: 1,
                sourceMap: isProduction,
                minimize: isProduction,
                localIdentName: isProduction
                  ? '[hash:base64:5]'
                  : '[name]_[local]_[hash:base64:5]',
              },
            },
            { loader: 'postcss-loader' },
          ],
        }),
      },
      {
        test: /\.css$/,
        exclude: fromRoot('src'),
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: isProduction,
                minimize: isProduction,
              },
            },
            { loader: 'postcss-loader' },
          ],
        }),
      },
      {
        test: /\.(jpg|png|gif|woff|woff2|ttf|eot)$/,
        use: [{ loader: 'file-loader' }],
      },
      {
        test: /\.svg$/,
        include: fromRoot('src'),
        use: [{ loader: 'svg-inline-loader' }],
      },
      {
        test: /\.svg$/,
        exclude: fromRoot('src'),
        use: [{ loader: 'file-loader' }],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin('NODE_ENV'),
    new ExtractTextPlugin(isProduction
      ? '[name].[contenthash:20].css'
      : '[name].css'),
    new HtmlWebpackPlugin({
      title: 'Basics',
      template: fromRoot('src/index.html'),
      inject: 'body',
    }),
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    isProduction && new webpack.optimize.ModuleConcatenationPlugin(),
    isProduction && new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  ].filter(Boolean),
  resolve: {
    modules: [fromRoot('src'), 'node_modules'],
    extensions: ['.js'],
  },
}
