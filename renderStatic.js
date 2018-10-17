const { promisify } = require('util')
const path = require('path')
const readFile = promisify(require('fs').readFile)
const writeFile = promisify(require('fs').writeFile)
const webpack = promisify(require('webpack'))
const cheerio = require('cheerio')

const spawnAsync = require('./scripts/lib/spawnAsync')
const baseConfig = require('./webpack.config')
const config = require('./webpack.config.static')

const fromRoot = path.resolve.bind(path, __dirname)
const baseDistPath = fromRoot(baseConfig.output.path)
const staticDistPath = fromRoot(config.output.path)

const renderStatic = async () => {
  await webpack(config)

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
