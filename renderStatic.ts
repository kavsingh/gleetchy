import { promisify } from 'util'
import path from 'path'
import { readFile as readFileCb, writeFile as writeFileCb } from 'fs'
import webpackApi, { Configuration } from 'webpack'
import cheerio from 'cheerio'

import spawnAsync from './scripts/lib/spawnAsync'
import { resolveFromProjectRoot as fromRoot } from './scripts/lib/util'
import { ApplicationState } from './src/state/configureStore'

import baseConfig from './webpack.config'
import staticConfig from './webpack.config.static'

const webpack = promisify(webpackApi)
const readFile = promisify(readFileCb)
const writeFile = promisify(writeFileCb)

const parseBaseConfig = (config: Configuration) => {
  const { output = {} } = config

  if (!output.path) {
    throw new Error('base config.output must have path defined')
  }

  return { baseOutputPath: output.path }
}

const parseStaticConfig = (config: Configuration) => {
  const { output = {} } = config
  const { library, filename, path: outputPath } = output

  if (!library || !outputPath || !filename) {
    throw new Error(
      'static config.output must have library, path, and filename defined',
    )
  }

  return {
    staticOutputPath: outputPath,
    staticOutputLibrary: library,
    staticOutputFilename: filename,
  }
}

const renderStatic = async (initialState: Partial<ApplicationState>) => {
  const { baseOutputPath } = parseBaseConfig(baseConfig as Configuration)
  const {
    staticOutputPath,
    staticOutputLibrary,
    staticOutputFilename,
  } = parseStaticConfig(staticConfig)

  const baseDistPath = fromRoot(baseOutputPath)
  const staticDistPath = fromRoot(staticOutputPath)
  const staticModulePath = fromRoot(staticOutputPath, staticOutputFilename)
  const libName = Array.isArray(staticOutputLibrary)
    ? staticOutputLibrary[0]
    : staticOutputLibrary

  await webpack([staticConfig])

  const { default: render } = require(staticModulePath)[libName]
  const html = await readFile(path.resolve(baseDistPath, 'index.html'), 'utf-8')
  const dom = cheerio.load(html)
  const appRoot = dom('#app-root')

  appRoot.attr('data-ssr-state', JSON.stringify(initialState))
  appRoot.html(render(initialState))

  await spawnAsync('rm', ['-rf', staticDistPath])
  await spawnAsync('cp', ['-r', baseDistPath, staticDistPath])

  return writeFile(path.resolve(staticDistPath, 'index.html'), dom.html())
}

renderStatic({})
