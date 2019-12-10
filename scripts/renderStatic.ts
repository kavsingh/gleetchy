import { promisify } from 'util'
import path from 'path'
import { writeFile } from 'fs'

import webpack, { Configuration } from 'webpack'
import { JSDOM } from 'jsdom'

import { ApplicationState } from '../src/state/configureStore'
import baseConfig from '../webpack.config'
import staticConfig from '../webpack.config.static'
import spawnAsync from './lib/spawnAsync'
import { resolveFromProjectRoot as fromRoot } from './lib/util'

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
  const staticModulePath = fromRoot(
    staticOutputPath,
    // TODO: properly deal with chunkdata => string
    typeof staticOutputFilename === 'string'
      ? staticOutputFilename
      : 'gleetchy',
  )

  await promisify(webpack)([staticConfig])
  const { default: render } = await import(staticModulePath)
  const dom = await JSDOM.fromFile(path.resolve(baseDistPath, 'index.html'))
  const appRoot = dom.window.document.querySelector('#app-root')

  if (!appRoot) throw new Error('Container element #app-root not found')

  appRoot.setAttribute('data-initialstate', JSON.stringify(initialState))
  appRoot.innerHTML = render(initialState)

  await spawnAsync('rm', ['-rf', staticDistPath])
  await spawnAsync('cp', ['-r', baseDistPath, staticDistPath])

  return promisify(writeFile)(
    path.resolve(staticDistPath, 'index.html'),
    dom.serialize(),
  )
}

renderStatic({})
