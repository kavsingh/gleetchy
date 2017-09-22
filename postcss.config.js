const cssNext = require('postcss-cssnext')

module.exports = ctx => ({
  map: ctx.env === 'development' ? ctx.map : false,
  from: ctx.from,
  to: ctx.to,
  plugins: [cssNext()],
})
