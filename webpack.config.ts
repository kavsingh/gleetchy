import webpack, { Configuration } from 'webpack'
import { Configuration as DevServerConfiguration } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WorkboxPlugin from 'workbox-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import PWAManifest from 'webpack-pwa-manifest'

import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'
import theme from './src/style/theme'

const servePublic = process.env.PUBLIC === 'true'
const isProduction = process.env.NODE_ENV === 'production'

export const publicPath = ''

const config: Configuration & { devServer: DevServerConfiguration } = {
  mode: isProduction ? 'production' : 'development',
  entry: {
    gleetchy: ['./src/index.tsx'],
  },
  target: 'web',
  output: {
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
    path: fromRoot('dist'),
    publicPath,
  },
  devServer: {
    host: servePublic ? '0.0.0.0' : 'localhost',
    port: 3000,
    inline: true,
    hot: true,
    historyApiFallback: true,
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
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV: 'development' }),
    new HtmlWebpackPlugin({
      title: 'Gleetchy',
      themeColor: theme.colorPage,
      template: fromRoot('src/index.html'),
      inject: 'body',
    }),
    new PWAManifest({
      name: 'Gleetchy',
      short_name: 'Gleetchy',
      start_url: process.env.PWA_START_URL || '/',
      display: 'fullscreen',
      theme_color: theme.colorPage,
      background_color: theme.colorPage,
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
      new WorkboxPlugin.GenerateSW({
        cacheId: 'gleetchy-sw',
        swDest: 'gleetchy-sw.js',
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            handler: 'CacheFirst',
            urlPattern: /[.](png|jpg|css|wav|ogg|mp3)/,
          },
          {
            handler: 'NetworkFirst',
            urlPattern: /^http.*/,
          },
        ],
      }),
    process.env.BUNDLE_ANALYZE === 'true' && new BundleAnalyzerPlugin(),
  ].filter(Boolean) as webpack.Plugin[],
  resolve: {
    alias: isProduction
      ? { react: 'preact/compat', 'react-dom': 'preact/compat' }
      : {},
    extensions: ['.ts', '.tsx', '.js'],
  },
}

export default config
