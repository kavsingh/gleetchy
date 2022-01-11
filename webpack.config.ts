import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import WorkboxPlugin from 'workbox-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import PWAManifest from 'webpack-pwa-manifest'
import color from 'color'

import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'
import { defaultTheme } from './src/style/theme'

import type { Configuration, WebpackPluginInstance } from 'webpack'

type ConfigurationFactory = (
  env?: string | Record<string, unknown>,
) => Configuration

const isProd = (env: Parameters<ConfigurationFactory>[0]) =>
  typeof env === 'string' ? env === 'production' : !!env?.production

export const publicPath = ''

const servePublic = process.env.PUBLIC === 'true'

const configFactory: ConfigurationFactory = (env) => ({
  mode: isProd(env) ? 'production' : 'development',
  devtool: isProd(env) ? 'source-map' : 'inline-cheap-source-map',
  entry: {
    gleetchy: ['./src/index.tsx'],
  },
  target: 'web',
  output: {
    publicPath,
    filename: isProd(env) ? '[name].[chunkhash].js' : '[name].js',
    path: fromRoot('dist'),
  },
  devServer: {
    host: servePublic ? '0.0.0.0' : 'localhost',
    hot: true,
    port: 3000,
    static: './dist',
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
      template: fromRoot('src/index.html'),
      inject: 'body',
    }),
    new PWAManifest({
      name: 'Gleetchy',
      short_name: 'Gleetchy',
      start_url: process.env.PWA_START_URL || '/',
      display: 'fullscreen',
      theme_color: color(defaultTheme.colors.page).hex(),
      background_color: color(defaultTheme.colors.page).hex(),
      icons: [
        ...[48, 72, 96, 144, 168, 192, 512].map((size) => ({
          src: fromRoot(`src/assets/icons/${size}x${size}.png`),
          sizes: [size],
        })),
        {
          src: fromRoot(`src/assets/icons/144x144.png`),
          sizes: [128],
        },
      ],
    }),
    isProd(env) &&
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
  ].filter(Boolean) as WebpackPluginInstance[],
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx'] },
})

export default configFactory
