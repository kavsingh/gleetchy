import { promisify } from 'util'
import path from 'path'
import { readFile as readFileCb, writeFile as writeFileCb } from 'fs'
import webpackApi from 'webpack'
import cheerio from 'cheerio'

import { PROJECT_ROOT } from './scripts/lib/constants'
import spawnAsync from './scripts/lib/spawnAsync'
import baseConfig from './webpack.config'
import config from './webpack.config.static'

const webpack = promisify(webpackApi)
const readFile = promisify(readFileCb)
const writeFile = promisify(writeFileCb)

const fromRoot = path.resolve.bind(path, PROJECT_ROOT)
const baseDistPath = fromRoot(baseConfig.output.path)
const staticDistPath = fromRoot(config.output.path)

const renderStatic = async () => {
  await webpack([config as any])

  // eslint-disable-next-line global-require, import/no-dynamic-require
  const staticModule = require(fromRoot(
    config.output.path,
    config.output.filename,
  ))
  const { default: render } = staticModule[config.output.library]
  const html = await readFile(path.resolve(baseDistPath, 'index.html'), 'utf-8')
  const dom = cheerio.load(html)

  dom('#app-root').html(render())

  await spawnAsync('rm', ['-rf', staticDistPath])
  await spawnAsync('cp', ['-r', baseDistPath, staticDistPath])

  return writeFile(path.resolve(staticDistPath, 'index.html'), dom.html())
}

renderStatic()
