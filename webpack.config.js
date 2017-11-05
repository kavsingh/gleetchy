// Consume from es6 imports in src
require('babel-register')({ plugins: ['transform-es2015-modules-commonjs'] })

const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BabelMinifyPlugin = require('babel-minify-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const PWAManifest = require('webpack-pwa-manifest')
const { COLOR_PAGE } = require('./src/constants/style')

const fromRoot = path.resolve.bind(path, __dirname)
const isProduction = process.env.NODE_ENV === 'production'
const servePublic = process.env.PUBLIC === 'true'
const publicPath = ''

module.exports = {
  entry: {
    gleetchy: ['./src/index.js'],
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
        test: /\.(wav|mp3|ogg|png)$/,
        use: [{ loader: 'file-loader' }],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    new HtmlWebpackPlugin({
      themeColor: COLOR_PAGE,
      title: 'Gleetchy',
      template: fromRoot('src/index.html'),
      inject: 'body',
    }),
    !isProduction && new webpack.HotModuleReplacementPlugin(),
    isProduction && new webpack.optimize.ModuleConcatenationPlugin(),
    isProduction && new BabelMinifyPlugin(),
    new PWAManifest({
      name: 'Gleetchy',
      short_name: 'Gleetchy',
      start_url: publicPath,
      display: 'fullscreen',
      theme_color: COLOR_PAGE,
      background_color: COLOR_PAGE,
      icons: [
        ...[48, 72, 96, 144, 168, 192, 512].map(size => ({
          src: fromRoot(`src/assets/icons/${size}x${size}.png`),
          sizes: [size],
        })),
        {
          src: fromRoot(`src/assets/icons/144x144.png`),
          sizes: [128],
        },
      ],
    }),
    isProduction &&
      new SWPrecachePlugin({
        cacheId: 'gleetchy-sw',
        filename: 'gleetchy-sw.js',
        minify: true,
        forceDelete: true,
        runtimeCaching: [
          {
            handler: 'fastest',
            urlPattern: /[.](png|jpg|css|wav|ogg|mp3)/,
          },
          {
            handler: 'networkFirst',
            urlPattern: /^http.*/,
          },
        ],
      }),
  ].filter(Boolean),
  resolve: {
    modules: [fromRoot('src'), 'node_modules'],
    alias: { '~': path.resolve(__dirname, 'src') },
    extensions: ['.js'],
  },
}
