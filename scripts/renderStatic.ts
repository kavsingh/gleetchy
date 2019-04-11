import { promisify } from 'util'
import path from 'path'
import { readFile as _readFile, writeFile as _writeFile } from 'fs'
import _webpack, { Configuration } from 'webpack'
import cheerio from 'cheerio'

import { ApplicationState } from '../src/state/configureStore'
import baseConfig from '../webpack.config'
import staticConfig from '../webpack.config.static'
import spawnAsync from './lib/spawnAsync'
import { resolveFromProjectRoot as fromRoot } from './lib/util'

const webpack = promisify(_webpack)
const readFile = promisify(_readFile)
const writeFile = promisify(_writeFile)

const parseBaseConfig = (config: Configuration) => {
  const { output = {} } = config

  if (!output.path) {
    throw new Error('base config.output must have path defined')
  }

  return { baseOutputPath: output.path }
}

const parseStaticConfig = (config: Configuration) => {
  const { output = {} } = config
  const { filename, path: outputPath } = output

  if (!outputPath || !filename) {
    throw new Error('static config.output must have path and filename defined')
  }

  return {
    staticOutputPath: outputPath,
    staticOutputFilename: filename,
  }
}

const renderStatic = async (initialState: Partial<ApplicationState>) => {
  const { baseOutputPath } = parseBaseConfig(baseConfig)
  const { staticOutputPath, staticOutputFilename } = parseStaticConfig(
    staticConfig,
  )

  const baseDistPath = fromRoot(baseOutputPath)
  const staticDistPath = fromRoot(staticOutputPath)
  const staticModulePath = fromRoot(staticOutputPath, staticOutputFilename)

  await webpack([staticConfig])
  const { default: render } = await import(staticModulePath)

  const html = await readFile(path.resolve(baseDistPath, 'index.html'), 'utf-8')
  const dom = cheerio.load(html)
  const appRoot = dom('#app-root')

  appRoot.attr('data-initialstate', JSON.stringify(initialState))
  appRoot.html(render(initialState))

  await spawnAsync('rm', ['-rf', staticDistPath])
  await spawnAsync('cp', ['-r', baseDistPath, staticDistPath])

  return writeFile(path.resolve(staticDistPath, 'index.html'), dom.html())
}

renderStatic({})
