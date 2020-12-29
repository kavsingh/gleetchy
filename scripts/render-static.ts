import { promisify } from 'util'
import path from 'path'
import { writeFile } from 'fs'

import webpack from 'webpack'
import { JSDOM } from 'jsdom'

import { ApplicationState } from '../src/state/configure-store'
import baseConfigFactory from '../webpack.config'
import staticConfigFactory from '../webpack.config.static'
import spawnAsync from './lib/spawn-async'
import { resolveFromProjectRoot as fromRoot } from './lib/util'

const parseBaseConfig = (config: typeof baseConfigFactory) => {
  const { output = {} } = config({ production: true })

  if (!output.path) {
    throw new Error('base config.output must have path defined')
  }

  return { baseOutputPath: output.path }
}

const parseStaticConfig = (config: typeof staticConfigFactory) => {
  const { output = {} } = config()
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
  const { baseOutputPath } = parseBaseConfig(baseConfigFactory)
  const { staticOutputPath, staticOutputFilename } = parseStaticConfig(
    staticConfigFactory,
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

  await promisify(webpack)([staticConfigFactory()])

  const { default: render } = await import(staticModulePath)
  const dom = await JSDOM.fromFile(path.resolve(baseDistPath, 'index.html'))
  const appRoot = dom.window.document.querySelector<HTMLElement>('#app-root')

  if (!appRoot) throw new Error('Container element #app-root not found')

  appRoot.dataset.ssrInitialState = JSON.stringify(initialState)
  appRoot.innerHTML = render(initialState)

  await spawnAsync('rm', ['-rf', staticDistPath])
  await spawnAsync('cp', ['-r', baseDistPath, staticDistPath])

  return promisify(writeFile)(
    path.resolve(staticDistPath, 'index.html'),
    dom.serialize(),
  )
}

renderStatic({})
